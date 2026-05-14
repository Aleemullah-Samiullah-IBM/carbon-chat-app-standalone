import React, {useState, useEffect} from 'react'
import {
  Button,
  ClickableTile,
  InlineNotification,
  SkeletonText,
} from '@carbon/react'
import {Add, Chat, Light, Asleep} from '@carbon/icons-react'
import {useError} from '@agent-ui/common/contexts/ErrorContext'
import {useAPI} from '@agent-ui/common/contexts/APIContext'
import {getErrorMessage} from '@agent-ui/common/utilities/helpers'
import cx from 'classnames'

import './LandingPage.scss'

interface Chat {
  id: string
  created_at: string
  last_interaction: string
}

interface LandingPageProps {
  chats: Chat[]
  onSelectChat: (chatId: string) => void
  onCreateNewChat: () => void
  isDarkTheme?: boolean
  onToggleTheme?: () => void
}

const formatLastInteractionDate = (dateString: string): string => {
  if (!dateString) return ''

  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`

  return date.toLocaleDateString()
}

export const LandingPage: React.FC<LandingPageProps> = ({
  chats,
  onSelectChat,
  onCreateNewChat,
  isDarkTheme = true,
  onToggleTheme,
}) => {
  const [chatTitles, setChatTitles] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<boolean>(true)

  const errorContext = useError()
  const error = errorContext?.error
  const clearError = errorContext?.clearError || (() => {})

  const {apiService} = useAPI()

  const landingPageClass = cx({
    'landing-page': true,
    'dark-mode': isDarkTheme,
  })

  useEffect(() => {
    const fetchChatTitles = async () => {
      setLoading(true)
      try {
        // Fetch each chat detail and extract title
        const titleEntries = await Promise.all(
          chats.map(async (chat: Chat) => {
            try {
              const chatRes = await apiService?.getChat(chat.id)
              const events = chatRes?.data?.events ?? []
              const title = extractTitleFromEvents(events)
              return [chat.id, title] as const
            } catch (e) {
              return [chat.id, ''] as const
            }
          }),
        )

        setChatTitles(Object.fromEntries(titleEntries))
      } catch (err) {
        console.log('Error fetching chat titles', err)
      } finally {
        setLoading(false)
      }
    }

    if (chats.length > 0) {
      fetchChatTitles()
    } else {
      setLoading(false)
    }
  }, [chats, apiService])

  const getChatPreview = (chat: Chat): string => {
    return chatTitles[chat.id] || 'Empty chat'
  }

  const extractTitleFromEvents = (events: any[]): string => {
    if (!Array.isArray(events) || events.length === 0) return ''
    return events[0].event.message ?? ''
  }

  return (
    <div className={landingPageClass}>
      <div className='landing-page-header'>
        <div className='header-content'>
          <h1 className='header-title'>Welcome to Carbon Chat App</h1>
          <p className='header-subtitle'>
            Select a chat to continue or create a new one
          </p>
        </div>
        <div className='header-actions'>
          <Button
            kind='primary'
            renderIcon={Add}
            onClick={() => onCreateNewChat()}
            className='new-chat-btn'
          >
            New chat
          </Button>
          {onToggleTheme && (
            <Button
              kind='ghost'
              size='md'
              renderIcon={isDarkTheme ? Light : Asleep}
              iconDescription={isDarkTheme ? 'Light mode' : 'Dark mode'}
              hasIconOnly
              onClick={onToggleTheme}
              tooltipPosition='bottom'
              className='theme-toggle-btn'
            />
          )}
        </div>
      </div>

      {error && (
        <InlineNotification
          aria-label='closes notification'
          kind='error'
          onClose={() => clearError()}
          onCloseButtonClick={() => clearError()}
          statusIconDescription='notification'
          subtitle={getErrorMessage(error)}
          title='Error'
          lowContrast
        />
      )}

      <div className='landing-page-content'>
        {loading ? (
          <div className='chat-list-skeleton'>
            {[1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className='chat-tile-skeleton'
              >
                <SkeletonText
                  heading={false}
                  lineCount={3}
                />
              </div>
            ))}
          </div>
        ) : chats.length === 0 ? (
          <div className='empty-state'>
            <Chat
              size={64}
              className='empty-state-icon'
            />
            <h2>No conversations yet</h2>
            <p>Click New Chat to start</p>
          </div>
        ) : (
          <div className='chat-list'>
            <h2 className='chat-list-title'>Recent chats</h2>
            <div className='chat-tiles'>
              {chats.map(chat => (
                <ClickableTile
                  key={chat.id}
                  className='chat-tile'
                  onClick={() => onSelectChat(chat.id)}
                >
                  <div className='chat-tile-header'>
                    <Chat
                      className='chat-tile-icon'
                      aria-label='Chat'
                    />
                    <span className='chat-tile-date'>
                      {formatLastInteractionDate(chat.last_interaction)}
                    </span>
                  </div>
                  <div className='chat-tile-preview'>
                    {getChatPreview(chat)}
                  </div>
                </ClickableTile>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LandingPage
