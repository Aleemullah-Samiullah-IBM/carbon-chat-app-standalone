import {useEffect, useState} from 'react'
import {Loading} from '@carbon/react'
import WatsonIcon from '../../icons/icons'
import {getCurrentTime} from '../../../utilities/helpers'

interface LoadingMessageProps {
  isDarkTheme: boolean
  showLoadingMessages?: boolean
}

export const LoadingMessage = ({
  isDarkTheme,
  showLoadingMessages = true,
}: LoadingMessageProps) => {
  const loadingMessages = [
    'Running...',
    'One moment...',
    'Please wait...',
    'Loading up...',
    'Getting things ready...',
    'Loading...',
    'Fetching...',
    'Retrieving...',
  ]
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length)
    }, 3000) // change message every 3s, looping
    return () => clearInterval(interval)
  }, [])

  return (
    <div className='message bot'>
      <header>
        <WatsonIcon fill={isDarkTheme ? '#ffffff' : '#000000'} />
        <span className='bot-header'>watsonx {getCurrentTime()}</span>
      </header>

      <div className='chat-bubble loading-content'>
        <Loading
          active
          small
          description='Loading'
          withOverlay={false}
        />

        {showLoadingMessages && <span>{loadingMessages[messageIndex]}</span>}
      </div>
    </div>
  )
}
