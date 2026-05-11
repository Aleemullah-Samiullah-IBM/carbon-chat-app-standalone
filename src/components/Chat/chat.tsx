import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {
  BusEventType,
  ChatCustomElement,
  ChatInstance,
  GenericItem,
  MessageResponseTypes,
  PublicConfig,
  TextItem,
  UserDefinedItem,
} from '@carbon/ai-chat'
import {
  ArtTools_01,
  WindowsHosting,
  DevAndTest,
  DesignResearch,
} from '@carbon/pictograms-react'

import {useAPI, APIProvider} from '@agent-ui/common/contexts/APIContext'
import {useMyContext, ChatProvider} from '@agent-ui/common/contexts/ChatContext'
import {ErrorProvider} from '@agent-ui/common/contexts/ErrorContext'

import {Command} from '@agent-ui/common/types'
import {renderUserDefinedResponse} from './renderUserDefinedResponses'
import {getErrorMessage, transformChatMessages} from '../../utilities/helpers'
import {
  feedbackOptions,
  getRenderWriteableElements,
} from '../../utilities/constants'
import {isQueryInProgress} from '../../utilities/customSendMessage'

import './chat.scss'

interface ChatProps {
  chatUUID: string
  config: PublicConfig
  onCreateNewChat: () => Promise<string | null>
  onReturnToLanding?: () => void
  isDarkTheme?: boolean
  onToggleTheme?: () => void
  viewMode?: 'fullscreen' | 'sidebar'
  onToggleViewMode?: () => void
}

// wrapper component to provide context to rendered components
// because renderUserDefinedResponse() rendered in separate
// React tree and has no access to my providers
export function ContextWrapper({children}: {children: React.ReactNode}) {
  return (
    <ErrorProvider>
      <ChatProvider>
        <APIProvider>{children}</APIProvider>
      </ChatProvider>
    </ErrorProvider>
  )
}

export const Chat: React.FC<ChatProps> = ({
  chatUUID,
  config,
  onCreateNewChat,
  onReturnToLanding,
  isDarkTheme = true,
  onToggleTheme,
  viewMode = 'fullscreen',
  onToggleViewMode,
}) => {
  const {
    apicTokenExpirationDate,
    startNewChat,
    setIsApprovalSubmitting,
    setStartNewChat,
    isApprovalSubmitting,
  } = useMyContext()
  const {apiService, porg} = useAPI()

  const [chatInstance, setChatInstance] = useState<ChatInstance>()
  const [commands, setCommands] = useState<Command[]>([])

  const lastMessageIdRef = useRef<string>('') // avoid useState here, doesn't work...
  const welcomeShownForChatRef = useRef<string>('') // track which chat we've shown welcome for
  const startNewChatRef = useRef<boolean>(startNewChat) // track startNewChat flag

  // Update ref when startNewChat changes
  useEffect(() => {
    startNewChatRef.current = startNewChat
  }, [startNewChat])

  const DEFAULT_TEXT = `Hi! I'm your API Assistant. You're now connected to API Connect provider organization ${porg}.
       \nExplore quick commands by typing "/" in the prompt line. Here are some tasks I can help with:
    `

  const WELCOME_MSG = [
    {
      response_type: MessageResponseTypes.TEXT,
      text: DEFAULT_TEXT,
    } as TextItem,
    {
      response_type: MessageResponseTypes.TEXT,
      text: `There are some limitations in what the API Assistant can do today. Please visit the documentation to [learn more.](https://www.ibm.com/products/api-connect)`,
    } as TextItem,
    {
      response_type: MessageResponseTypes.USER_DEFINED,
      user_defined: {
        type: 'welcome',
        welcome_data: [
          {icon: ArtTools_01, message: 'Create API'},
          {icon: WindowsHosting, message: 'Publish API'},
          {icon: DevAndTest, message: 'Query Analytics'},
          {icon: DesignResearch, message: 'Search APIs'},
        ],
      },
    } as UserDefinedItem,
  ]

  // fetch commands when chatUUID is available
  useEffect(() => {
    const fetchCommands = async () => {
      try {
        const res = await apiService?.getCommands(chatUUID)
        const fetchedCommands = res?.data || []
        setCommands(fetchedCommands)
      } catch (error) {
        console.error(`Error fetching commands for ${chatUUID}`, error)
      }
    }

    if (chatUUID && apiService) {
      fetchCommands()
    }
  }, [chatUUID, apiService])

  useEffect(() => {
    if (chatInstance && chatUUID) {
      // If startNewChat is true, DON'T show welcome here - let CHAT_READY handle it
      // Just skip fetching history

      // Otherwise, fetch chat history
      const fetchData = async () => {
        try {
          const res = await apiService?.getChat(chatUUID)
          const selectedSession = res?.data
          let events = selectedSession.events || []
          const formattedHistory = transformChatMessages(chatUUID, events)

          if (formattedHistory.length > 0) {
            chatInstance.messaging.clearConversation()
            chatInstance?.messaging.insertHistory(formattedHistory)

            // check if last message from history is a toolcall
            const lastItem = events[events.length - 1]
            if (lastItem.event.planned_toolcalls.length > 0) {
              lastMessageIdRef.current =
                formattedHistory[formattedHistory.length - 1].message.id
            }
          } else {
            // Only show welcome message if we haven't already shown it for this chat
            if (welcomeShownForChatRef.current !== chatUUID) {
              chatInstance.messaging.addMessage({
                output: {
                  generic: WELCOME_MSG,
                },
              })
              welcomeShownForChatRef.current = chatUUID
            }
          }
          chatInstance.updateIsMessageLoadingCounter('reset')

          // Monitor and reset spurious loading counter increments that occur
          // a few seconds after opening an existing chat
          setTimeout(() => {
            const monitorInterval = setInterval(() => {
              const counter =
                (chatInstance as any).getState().isMessageLoadingCounter || 0

              // Only reset if counter > 0 AND no query is in progress
              if (counter > 0 && !isQueryInProgress()) {
                chatInstance.updateIsMessageLoadingCounter('reset')
              }
            }, 100)

            // Stop monitoring after 10 seconds (spurious increment happens within first few seconds)
            setTimeout(() => clearInterval(monitorInterval), 10000)
          }, 2000) // Start monitoring after 2 seconds
        } catch (error) {
          console.error(`Error fetching chat data for ${chatUUID}`, error)
        }
      }

      fetchData()
    }
  }, [chatInstance, chatUUID, startNewChat])

  const handleMode = async (
    type: string,
    data: any,
    instance?: ChatInstance,
  ) => {
    let response: any = null

    setIsApprovalSubmitting(true) // disable the Plan's Start/ Continue button

    if (type === 'plan' && instance) {
      try {
        // show loading indicator dots
        instance.updateIsChatLoadingCounter('increase')

        const res = await apiService?.postPlan(
          chatUUID,
          data?.planned_toolcalls,
        )
        response = res?.data
        console.log('postPlan', response, chatInstance)

        // todo why did i have to pass instance in because chatInstance = null?
        instance.messaging.addMessage({
          output: {
            generic: [
              {
                response_type: MessageResponseTypes.TEXT,
                text: response.agent_message,
              },

              {
                response_type: MessageResponseTypes.USER_DEFINED,
                user_defined: {
                  type: 'block',
                  block_data: response.response_details,
                  message_options: {
                    feedback: feedbackOptions, // todo need some relevant id
                  },
                },
              } as UserDefinedItem,
              {
                response_type: MessageResponseTypes.USER_DEFINED,
                user_defined: {
                  type: 'plan',
                  plan_data: response,
                  message_options: {
                    feedback: feedbackOptions, // todo need some relevant id
                  },
                },
              } as UserDefinedItem,
            ],
          },
        })

        instance.updateIsChatLoadingCounter('decrease')
      } catch (error: unknown) {
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

        instance.updateIsChatLoadingCounter('decrease')
      } finally {
        // setFetching(false)
        setIsApprovalSubmitting(false)
      }
    }

    // handle more event types accordingly...
  }

  // renderUserDefinedResponse function has been moved to a separate file
  // wrap it to pass lastMessageId and provide context
  const renderUserDefinedResponseWrapper = (
    state: any,
    instance: ChatInstance,
  ) => {
    const result = renderUserDefinedResponse(
      state,
      instance,
      handleMode,
      lastMessageIdRef.current,
      isApprovalSubmitting,
      apiService,
    )

    // wrap with ContextWrapper to provide contexts to components
    return result ? <ContextWrapper>{result}</ContextWrapper> : result
  }

  const renderWriteableElements = useMemo(
    () =>
      chatInstance
        ? getRenderWriteableElements(
            chatInstance,
            commands,
            onReturnToLanding,
            onCreateNewChat,
            isDarkTheme,
            onToggleTheme,
            viewMode,
            onToggleViewMode,
          )
        : undefined,
    [
      chatInstance,
      commands,
      onReturnToLanding,
      onCreateNewChat,
      isDarkTheme,
      onToggleTheme,
      viewMode,
      onToggleViewMode,
    ],
  )

  const onBeforeRender = (instance: ChatInstance) => {
    console.log('onBeforeRender', instance)

    // Note: In @carbon/ai-chat v1.7.0+, header and homescreen configs
    // should be set in the initial config, not via update methods
    // These update methods have been removed in the new version

    setChatInstance(instance)
    instance.on({type: BusEventType.PRE_RECEIVE, handler: preReceiveHandler})
    instance.on({type: BusEventType.PRE_SEND, handler: preSendHandler})
    instance.on({
      type: BusEventType.PRE_RESTART_CONVERSATION,
      handler: preRestartHandler,
    })

    instance.once({
      type: BusEventType.CHAT_READY,
      handler: () => {
        // If this is a new chat, show welcome message now that chat is ready
        if (
          startNewChatRef.current &&
          welcomeShownForChatRef.current !== chatUUID
        ) {
          instance.messaging.clearConversation()
          instance.messaging.addMessage({
            output: {
              generic: WELCOME_MSG,
            },
          })
          welcomeShownForChatRef.current = chatUUID
          setStartNewChat(false)
          startNewChatRef.current = false
        }

        const messageInput = instance.elements?.getMessageInput()
        if (messageInput) {
          messageInput.getHTMLElement()
          // .addEventListener('keydown', event =>
          //   console.log('Got keydown', event),
          // )

          messageInput.addChangeListener((value: string) => {
            if (value.startsWith('/')) {
              const div = document.querySelector('.actions-menu') as HTMLElement

              if (div) {
                div.style.display = 'block'
              }
            } else {
              const div = document.querySelector('.actions-menu') as HTMLElement

              if (div) {
                div.style.display = 'none'
              }
            }
          })
        }
      },
    })
  }

  // event handlers

  // Update the lastMessageId ref when the pre-receive handler is triggered
  const preReceiveHandler = useCallback((event: any) => {
    const message = event.data
    console.log('preReceiveHandler', message.id)
    lastMessageIdRef.current = message.id
  }, [])

  function preSendHandler(_event: any) {
    const div = document.querySelector('.disclaimer') as HTMLElement

    if (div) {
      div.style.display = 'none'
    }
  }

  const preRestartHandler = useCallback(
    async (event: any) => {
      // const message = event
      console.log('preRestartHandler')

      // if local dev, porg is already defined in .authentication.json
      // if (apicTokenExpirationDate === 'indefinite') {
      // Create a new chat which will return new UUID and trigger welcome message
      await onCreateNewChat()
      // } else {
      //   // setShowPorgSelection(true)
      // }
    },
    [apicTokenExpirationDate, onCreateNewChat],
  )

  return (
    <div onClick={() => console.log('state', chatInstance?.getState())}>
      <ChatCustomElement
        key={`chat-${chatUUID}-${commands.length}-${isDarkTheme ? 'dark' : 'light'}-${viewMode}`}
        {...config}
        className={`${viewMode} messages`}
        onBeforeRender={onBeforeRender}
        renderUserDefinedResponse={renderUserDefinedResponseWrapper}
        renderWriteableElements={renderWriteableElements}
        customSendMessage={(config as any).customSendMessage}
      />
    </div>
  )
}
