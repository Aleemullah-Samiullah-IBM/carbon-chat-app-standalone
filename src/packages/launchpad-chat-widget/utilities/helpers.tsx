import {ChatEvent, PlanEvent} from '@agent-ui/common/types/Message'
import {CarbonTheme, MessageResponseTypes, PublicConfig} from '@carbon/ai-chat'
import {MutableRefObject} from 'react'

import {customSendMessage} from './customSendMessage'
import ApiService from '@agent-ui/common/services/apiservice'
import {ChatContextType} from '@agent-ui/common/contexts/ChatContext'
import {ArtifactMetadata} from '@agent-ui/common/types/FileData'

export function transformChatMessages(
  chatUUID: string,
  events: ChatEvent[],
): any[] {
  function isBlockEvent(event: any): event is PlanEvent {
    return (event as PlanEvent).response_details !== undefined
  }

  function isPlanEvent(event: any): event is PlanEvent {
    return (
      ('executed_toolcalls' in event && event.executed_toolcalls.length > 0) ||
      ('planned_toolcalls' in event && event.planned_toolcalls.length > 0)
    )
  }

  return events
    .filter(
      item =>
        item.event.type === 'user-message' ||
        item.event.type === 'agent-plan' ||
        item.event.type === 'agent-message',
    )
    .map(item => {
      let messageText = ''

      switch (item.event.type) {
        case 'user-message':
          messageText = item.event.message || ''
          break

        case 'agent-plan':
          messageText = item.event.agent_message || ''
          break

        case 'agent-message':
          messageText = item.event.agent_message || ''
          break

        default:
          messageText = ''
          break
      }

      console.log('transformChatMessages')

      if (item.event.type === 'user-message') {
        // for user, use 'input' structure
        return {
          message: {
            id: crypto.randomUUID(),
            input: {
              text: messageText,
            },
          },
          time: new Date(item.timestamp).toLocaleString(),
        }
      } else {
        // for other types (agent-plan, agent-message, etc.), use 'output' structure
        const message = {
          message: {
            id: crypto.randomUUID(),
            output: {
              generic: [
                {
                  response_type: MessageResponseTypes.TEXT,
                  text: messageText,
                },
              ],
            },
          },
          time: new Date(item.timestamp).toLocaleString(),
        }

        if (isBlockEvent(item.event)) {
          message.message.output.generic.push({
            response_type: MessageResponseTypes.USER_DEFINED,
            text: '-',
            user_defined: {
              type: 'block',
              block_data: item.event.response_details,
            },
          } as any) // hack
        }

        if (isPlanEvent(item.event)) {
          message.message.output.generic.push({
            response_type: MessageResponseTypes.USER_DEFINED,
            user_defined: {
              type: 'plan',
              plan_data: item.event,
            },
          } as any) // hack

          // message.message.output.generic.push({
          //   response_type: MessageResponseTypes.USER_DEFINED,
          //   user_defined: {
          //     type: 'meow',
          //     text: 'Some text from your back-end.',
          //   },
          // } as any) // hack

          if (
            item.event &&
            item.event.suggested_actions &&
            item.event.suggested_actions.length > 0
          ) {
            message.message.output.generic.push({
              response_type: MessageResponseTypes.USER_DEFINED,
              user_defined: {
                type: 'suggested_actions',
                suggested_actions_data: item.event,
                message_options: {
                  // feedback: feedbackOptions,
                },
              },
            } as any) // hack
          }

          let attachments =
            item.event.response_details?.flatMap(
              (r: {artifacts?: ArtifactMetadata[]}) => r.artifacts || [],
            ) ?? []

          if (attachments.length > 0) {
            message.message.output.generic.push({
              response_type: MessageResponseTypes.USER_DEFINED,
              user_defined: {
                type: 'attachments',
                chatUUID: chatUUID,
                attachments: attachments,
                message_options: {
                  // feedback: feedbackOptions,
                },
              },
            } as any) // hack
          }
        }

        return message
      }
    })
}

export function getChatConfig(
  chatUUID: string,
  apiService: ApiService | null,
  porg: string | number | undefined,
  isDarkTheme: boolean,
  chatContextRef?: MutableRefObject<ChatContextType>,
) {
  let defaultConfig: PublicConfig = {
    // debug: true,
    header: {
      showRestartButton: false,
      hideMinimizeButton: true,
    },
    // homescreen: {
    //   greeting: 'Hello, how can I help you?',
    //   isOn: true,
    // },
    aiEnabled: true,
    injectCarbonTheme: isDarkTheme ? CarbonTheme.G90 : CarbonTheme.G10,
    layout: {
      showFrame: false,
    },
    messaging: {
      customSendMessage: (
        request: any,
        requestOptions: any,
        chatInstance: any,
      ) => {
        customSendMessage(
          request,
          requestOptions,
          chatInstance,
          chatUUID,
          apiService,
          porg,
          chatContextRef,
        )
      },
    },
    openChatByDefault: true,
  }
  return defaultConfig
}

// Helper function to extract error message from different error types
export const getErrorMessage = (error: any): string => {
  if (error?.element) {
    return error.message
  } else if (error instanceof Error) {
    return error.message
  } else {
    return String(error)
  }
}
