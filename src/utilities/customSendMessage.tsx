import {
  ChatInstance,
  CompleteItemChunk,
  CustomSendMessageOptions,
  GenericItem,
  MessageRequest,
  MessageResponse,
  MessageResponseTypes,
  OptionItem,
  PartialItemChunk,
  ReasoningStep,
  StreamChunk,
  UserDefinedItem,
} from '@carbon/ai-chat'
import {MutableRefObject} from 'react'
import ApiService from '@agent-ui/common/services/apiservice'
import {ChatContextType} from '@agent-ui/common/contexts/ChatContext'
import {getErrorMessage} from './helpers'
import {getEventFlags} from '@agent-ui/common/components/message/message-helpers'
import {ArtifactMetadata} from '@agent-ui/common/types/FileData'

const TEXT_ITEM_ID = 'text-1'

let sseConnectionRef: {close: () => void} | null = null
let receivedFinalEventRef = true

// Export a function to check if a query is in progress
export function isQueryInProgress(): boolean {
  return !receivedFinalEventRef
}

async function sendCustomMessage(
  request: MessageRequest,
  requestOptions: CustomSendMessageOptions,
  instance: ChatInstance,
  chatUUID: string,
  apiService: ApiService | null,
  porg: string | number | undefined,
  chatContextRef?: MutableRefObject<ChatContextType>,
) {
  const signal = requestOptions?.signal
  let isCanceled = false

  if (signal?.aborted) {
    isCanceled = true
  }

  const abortHandler = () => {
    isCanceled = true
    if (sseConnectionRef) {
      sseConnectionRef.close()
      sseConnectionRef = null
    }
  }
  signal?.addEventListener('abort', abortHandler)

  if (chatUUID && request.input.text) {
    try {
      receivedFinalEventRef = false
      const responseID = crypto.randomUUID()

      if (sseConnectionRef) {
        sseConnectionRef.close()
        sseConnectionRef = null
      }

      const onMessage = async (event: any) => {
        if (isCanceled) return

        const {data, type} = event

        try {
          const parsedData = JSON.parse(data)

          if (type === 'agent-event') {
            // Mark as received IMMEDIATELY so onClose doesn't fire the error
            // (onClose can fire while we're still in the async streaming loop)
            receivedFinalEventRef = true

            // Build reasoning steps from plan + executed tool calls
            const reasoningSteps: ReasoningStep[] = []

            if (parsedData.plan_title || parsedData.plan_description) {
              reasoningSteps.push({
                title: parsedData.plan_title || 'Plan',
                content: parsedData.plan_description || undefined,
              })
            }

            if (parsedData.executed_toolcalls?.length > 0) {
              for (const tool of parsedData.executed_toolcalls) {
                const detail = parsedData.response_details?.find(
                  (d: any) => d.step_id === tool.step_id,
                )
                reasoningSteps.push({
                  title: tool.title || tool.name,
                  content:
                    detail?.agent_info ||
                    detail?.output ||
                    tool.description ||
                    undefined,
                })
              }
            }

            // Also include top-level reasoning field if present
            if (parsedData.reasoning) {
              reasoningSteps.push({
                title: 'Reasoning',
                content: parsedData.reasoning,
              })
            }

            const agentMessage = parsedData.agent_message || ''

            // Helper to yield to the browser between chunks.
            // A short delay (50ms) is enough for word-by-word streaming.
            // A longer delay (200ms) is used after the reasoning chunk so React
            // has time to paint the reasoning steps before text starts appearing.
            const yieldToBrowser = (ms = 50) =>
              new Promise<void>(resolve => setTimeout(resolve, ms))

            // Step 1: Send reasoning steps FIRST via partial_response.message_options
            // streaming_metadata.response_id is required to establish the messageID.
            // We set open_state: 'open' to PREVENT the default auto-collapse behavior
            // (which would collapse reasoning as soon as text content appears).
            if (reasoningSteps.length > 0) {
              const reasoningChunk: PartialItemChunk = {
                partial_item: {
                  response_type: MessageResponseTypes.TEXT,
                  text: '',
                  streaming_metadata: {
                    id: TEXT_ITEM_ID,
                    cancellable: false,
                  },
                },
                partial_response: {
                  message_options: {
                    // open_state: 'open' keeps the reasoning panel open even when
                    // text starts streaming in (overrides the default auto-collapse)
                    reasoning: {
                      steps: reasoningSteps,
                      open_state: 'open' as any,
                    },
                  },
                },
                streaming_metadata: {
                  response_id: responseID,
                },
              }
              await instance.messaging.addMessageChunk(reasoningChunk)
              // Yield to browser so React can paint the reasoning steps
              await yieldToBrowser(200)

              // Step 2: Stream the text word-by-word AFTER reasoning is shown
              const words = agentMessage.split(' ')
              for (const word of words) {
                if (isCanceled) break
                const wordChunk: PartialItemChunk = {
                  partial_item: {
                    response_type: MessageResponseTypes.TEXT,
                    text: word + ' ',
                    streaming_metadata: {
                      id: TEXT_ITEM_ID,
                      cancellable: true,
                    },
                  },
                  streaming_metadata: {
                    response_id: responseID,
                  },
                }
                await instance.messaging.addMessageChunk(wordChunk)
                await yieldToBrowser(50)
              }
            }

            // Step 3: Send the complete text item
            const completeItem = {
              response_type: MessageResponseTypes.TEXT,
              text: agentMessage,
              streaming_metadata: {
                id: TEXT_ITEM_ID,
              },
            }

            const completeChunk: CompleteItemChunk = {
              complete_item: completeItem,
              partial_response:
                reasoningSteps.length > 0
                  ? {
                      message_options: {
                        // Keep open during complete chunk too
                        reasoning: {
                          steps: reasoningSteps,
                          open_state: 'open' as any,
                        },
                      },
                    }
                  : undefined,
              streaming_metadata: {
                response_id: responseID,
              },
            }
            await instance.messaging.addMessageChunk(completeChunk)

            // Step 4: Build and send final_response with reasoning in message_options.
            // Switch open_state back to 'default' so the reasoning auto-collapses
            // after streaming is complete (normal post-response behavior).
            const finalResponse = buildFinalResponse(
              parsedData,
              responseID,
              completeItem,
              chatUUID,
              chatContextRef,
            )

            if (reasoningSteps.length > 0) {
              finalResponse.message_options = {
                // 'default' = auto-collapse now that the response is complete
                reasoning: {
                  steps: reasoningSteps,
                  open_state: 'default' as any,
                },
              }
            }

            instance.messaging.addMessageChunk({
              final_response: finalResponse,
            } as StreamChunk)
          }
        } catch (err) {
          // Silently ignore parse errors for non-JSON events
        }
      }

      const onError = (err: any) => {
        instance.messaging.addMessage({
          output: {
            generic: [
              {
                response_type: MessageResponseTypes.INLINE_ERROR,
                text: 'Streaming error occurred',
              } as GenericItem,
            ],
          },
        })
      }

      const onClose = () => {
        if (!receivedFinalEventRef && !isCanceled) {
          instance.messaging.addMessage({
            output: {
              generic: [
                {
                  response_type: MessageResponseTypes.INLINE_ERROR,
                  text: 'Request failed: Stream ended unexpectedly',
                } as GenericItem,
              ],
            },
          })
        }
      }

      const connection = apiService?.streamChat(
        chatUUID,
        request.input.text,
        [],
        onMessage,
        onError,
        undefined,
        onClose,
      )

      if (connection) {
        sseConnectionRef = connection
      }

      return
    } catch (error) {
      instance.messaging.addMessage({
        output: {
          generic: [
            {
              response_type: MessageResponseTypes.INLINE_ERROR,
              text: getErrorMessage(error),
            } as GenericItem,
          ],
        },
      })
      return
    } finally {
      signal?.removeEventListener('abort', abortHandler)
    }
  }
}

function buildFinalResponse(
  response: any,
  responseID: string,
  completeItem: any,
  chatUUID: string,
  chatContextRef?: MutableRefObject<ChatContextType>,
): MessageResponse {
  if (response?.planned_toolcalls?.length > 0 && chatContextRef?.current) {
    chatContextRef.current.setIsApprovalSubmitting(false)
  }

  const {isPlanEvent} = getEventFlags(response)
  let attachments: ArtifactMetadata[] = []

  const finalResponse: MessageResponse = {
    id: responseID,
    output: {
      generic: [completeItem],
    },
  }

  switch (response?.type) {
    case 'agent-message': {
      const options = response.suggested_actions?.map((key: string) => ({
        label: key,
        value: {input: {text: key}},
      }))
      if (options && options.length > 0) {
        finalResponse.output.generic?.push({
          response_type: MessageResponseTypes.OPTION,
          options,
          preference: 'button',
        } as OptionItem)
      }
      break
    }

    case 'agent-plan': {
      if (isPlanEvent) {
        finalResponse.output.generic?.push({
          response_type: MessageResponseTypes.USER_DEFINED,
          user_defined: {
            type: 'plan',
            plan_data: response,
            message_options: {},
          },
        } as UserDefinedItem)

        if (response.suggested_actions?.length > 0) {
          finalResponse.output.generic?.push({
            response_type: MessageResponseTypes.USER_DEFINED,
            user_defined: {
              type: 'suggested_actions',
              suggested_actions_data: response,
              message_options: {},
            },
          } as UserDefinedItem)
        }

        attachments =
          response.response_details?.flatMap(
            (r: {artifacts?: ArtifactMetadata[]}) => r.artifacts || [],
          ) ?? []

        if (attachments.length > 0) {
          finalResponse.output.generic?.push({
            response_type: MessageResponseTypes.USER_DEFINED,
            user_defined: {
              type: 'attachments',
              attachments,
              message_options: {},
            },
          } as UserDefinedItem)
        }
      }
      break
    }
  }

  return finalResponse
}

export {sendCustomMessage as customSendMessage}
