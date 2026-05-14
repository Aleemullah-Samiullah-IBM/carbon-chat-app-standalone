import {Button, OverflowMenu, OverflowMenuItem} from '@carbon/react'
import {ChevronDown, OverflowMenuVertical} from '@carbon/react/icons'
import {useTranslation} from 'react-i18next'
import WatsonIcon from '../../icons/icons'

const MessageHeader = ({
  timestamp,
  isDarkTheme,
  showSteps,
  showReasoning,
  expandSteps,
  setExpandSteps,
  expandReasoning,
  setExpandReasoning,
  debugResponse,
  setExpandDetails,
  setIdDetailType,
}: {
  timestamp: string
  isDarkTheme: boolean
  showSteps: boolean | undefined
  showReasoning: boolean | undefined
  expandSteps: boolean
  setExpandSteps: React.Dispatch<React.SetStateAction<boolean>>
  expandReasoning: boolean
  setExpandReasoning: React.Dispatch<React.SetStateAction<boolean>>
  debugResponse: string
  setExpandDetails: (e: boolean) => void
  setIdDetailType: (type: 'chatUUID' | 'reqID' | 'debug') => void
}) => {
  const {t} = useTranslation()

  return (
    <header className='sender-type'>
      <WatsonIcon fill={isDarkTheme ? '#ffffff' : '#000000'} />
      <span className='bot-header'>
        watsonx {timestamp}{' '}
        {(showSteps || showReasoning) && (
          <span className='pipe-separator'>|</span>
        )}
      </span>

      {showSteps && (
        <Button
          kind='ghost'
          className='show-steps-toggle'
          onClick={() => setExpandSteps(prev => !prev)}
        >
          {expandSteps
            ? t('messageHeader.hideSteps')
            : t('messageHeader.showSteps')}{' '}
          <ChevronDown
            className={`${isDarkTheme ? 'isDark' : 'isLight'} ${expandSteps ? 'rotated' : ''}`}
          />
        </Button>
      )}

      {showReasoning && (
        <Button
          kind='ghost'
          className='show-steps-toggle'
          onClick={() => setExpandReasoning(prev => !prev)}
        >
          {expandReasoning
            ? t('messageHeader.hideScratchpad')
            : t('messageHeader.showScratchpad')}{' '}
          <ChevronDown
            className={`${isDarkTheme ? 'isDark' : 'isLight'} ${expandReasoning ? 'rotated' : ''}`}
          />
        </Button>
      )}

      <OverflowMenu
        aria-label='overflow-menu'
        flipped
        renderIcon={() => <OverflowMenuVertical />}
        className='agent-ui-overflow-menu'
      >
        <OverflowMenuItem
          className='agent-ui-menu-item'
          itemText={t('messageHeader.chatSessionId')}
          onClick={() => {
            setExpandDetails(true)
            setIdDetailType('chatUUID')
          }}
        />
        <OverflowMenuItem
          className='agent-ui-menu-item'
          itemText={t('messageHeader.requestId')}
          onClick={() => {
            setExpandDetails(true)
            setIdDetailType('reqID')
          }}
        />
        {debugResponse && (
          <OverflowMenuItem
            className='agent-ui-menu-item'
            itemText={t('messageHeader.debug')}
            onClick={() => {
              setExpandDetails(true)
              setIdDetailType('debug')
            }}
          />
        )}
      </OverflowMenu>
    </header>
  )
}

export default MessageHeader
