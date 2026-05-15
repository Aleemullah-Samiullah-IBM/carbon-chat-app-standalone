import {useEffect, useMemo, useRef, useState} from 'react'
import {useMyContext} from '@agent-ui/common/contexts/ChatContext'
import {useAPI} from '@agent-ui/common/contexts/APIContext'
import {useError} from '@agent-ui/common/contexts/ErrorContext'

import {Block} from '@agent-ui/common/components/block/block'
import {getAuthContext, getFrontendContext} from './platform/platform'
import {getChatConfig} from './utilities/helpers'
import {Chat} from './components/Chat/chat'
import {LandingPage} from './components/LandingPage/LandingPage'

// const API_CONFIG = {
//   hostUrl: 'http://localhost:6005',
//   token: 'abc',
//   user: 'steve',
//   org: 'org-one',
// }

const API_CONFIG = {
    hostUrl: "http://9.60.195.73:6767",
    token: "Bearer 6769420",
    user: "sample_test",
    org: "ibm_test"
  }

export const App = () => {
  const [chatUUID, setChatUUID] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [showLanding, setShowLanding] = useState<boolean>(true)
  const [allChats, setAllChats] = useState<any[]>([])
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState<'fullscreen' | 'sidebar'>('fullscreen')
  const {setStartNewChat} = useMyContext()
  const {apiService, configureService} = useAPI()
  const {clearError} = useError()

  const handleChatHistory = (chatHistory: any[]) => {
    setAllChats(chatHistory)
    return chatHistory.length > 0
  }

  const createNewChat = async () => {
    try {
      const res = await apiService?.createNewChat()
      const newChatResponse = res?.data

      if (newChatResponse?.id) {
        setChatUUID(newChatResponse.id)
        setStartNewChat(true) // signal to show welcome message
        setShowLanding(false) // navigate to chat view
        // Note: Don't call fetchData() here as it will navigate back to landing page
        return newChatResponse.id // return the new chat UUID
      } else {
        console.error('Error creating new chat:', newChatResponse)
        return null
      }
    } catch (error) {
      console.error('Error creating new chat:', error)
      return null
    }
  }

  const handleNoHistory = async () => {
    clearError()
    // Don't auto-create chat, just show landing page
    setShowLanding(true)
  }

  const fetchData = async () => {
    if (!API_CONFIG.org || !API_CONFIG.user) return

    setIsLoading(true)
    try {
      const res = await apiService?.getAllChats()
      const chatHistory = res?.data

      const hasHistory = chatHistory && handleChatHistory(chatHistory)
      if (!hasHistory) {
        await handleNoHistory()
      } else {
        setShowLanding(true) // Show landing page with chat list
      }
    } catch (err) {
      console.log('Error occurred when fetching chats', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (API_CONFIG.hostUrl && API_CONFIG.token) {
      configureService(
        API_CONFIG.hostUrl,
        '',
        API_CONFIG.token,
        API_CONFIG.user ?? '',
        API_CONFIG.org ?? '',
        getFrontendContext(),
        getAuthContext(),
      )
    }
  }, [])

  useEffect(() => {
    if (apiService) {
      fetchData()
    }
  }, [apiService])

  const chatContext = useMyContext()
  const chatContextRef = useRef(chatContext)

  // Update ref when context changes, but don't trigger re-renders
  useEffect(() => {
    chatContextRef.current = chatContext
  }, [chatContext])

  const chatConfig = useMemo(() => {
    if (chatUUID) {
      return getChatConfig(
        chatUUID,
        apiService,
        API_CONFIG.org,
        isDarkTheme,
        chatContextRef,
      )
    }
    return null
  }, [chatUUID, apiService, isDarkTheme])

  const handleSelectChat = (chatId: string) => {
    setChatUUID(chatId)
    setShowLanding(false)
    setStartNewChat(false) // Don't show welcome message for existing chats
  }

  const handleReturnToLanding = () => {
    setShowLanding(true)
    fetchData() // Refresh chat list
  }

  if (isLoading) {
    return <div>Loading chat data...</div>
  }

  return (
    <div>
      {showLanding ? (
        <LandingPage
          chats={allChats}
          onSelectChat={handleSelectChat}
          onCreateNewChat={createNewChat}
          isDarkTheme={isDarkTheme}
          onToggleTheme={() => setIsDarkTheme(!isDarkTheme)}
        />
      ) : (
        <>
          {chatUUID && chatConfig && (
            <Chat
              chatUUID={chatUUID}
              config={chatConfig}
              onCreateNewChat={createNewChat}
              onReturnToLanding={handleReturnToLanding}
              isDarkTheme={isDarkTheme}
              onToggleTheme={() => setIsDarkTheme(!isDarkTheme)}
              viewMode={viewMode}
              onToggleViewMode={() => setViewMode(prev => prev === 'fullscreen' ? 'sidebar' : 'fullscreen')}
            />
          )}
        </>
      )}
    </div>
  )
}
