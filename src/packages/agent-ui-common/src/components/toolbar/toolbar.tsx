import {
  Menu,
  NewTab,
  Logout,
  Launch,
  Minimize,
  Maximize,
} from '@carbon/react/icons'
import {
  AILabel,
  AILabelContent,
  Button,
  Header,
  HeaderName,
  OverflowMenu,
  OverflowMenuItem,
  Theme,
  Tooltip,
} from '@carbon/react'
import {useTranslation} from 'react-i18next'

import {useMyContext} from '../../contexts/ChatContext'
import {useAPI} from '../../contexts/APIContext'

import {PlatformAPI} from '../../interfaces/platform'
import {LANGUAGE_DISPLAY_NAMES} from '../../constants'

import './toolbar.scss'

export type ToolbarButton = {
  buttonIcon: React.ComponentType<any>
  callback: () => void
  label: string
}

type ToolbarProps = {
  label?: string
  onClickCallback: (button: string) => void
  isDarkTheme: boolean
  platformAPI: PlatformAPI
  frontendClientType?: string
  hideToolbarMenu?: boolean
  showCustomHeaderMenuItem?: boolean
  showSidebarButton?: boolean
  sidebarOpen?: boolean
  dropdownButtons?: ToolbarButton[]
  rightButtons?: ToolbarButton[]
}

export default function Toolbar({
  label = 'ARIA Agent',
  onClickCallback,
  isDarkTheme,
  platformAPI,
  frontendClientType = 'vscode', // used to determine whether to show switch org or not
  hideToolbarMenu = false,
  showCustomHeaderMenuItem = false,
  showSidebarButton = false,
  sidebarOpen = false,
  dropdownButtons = [],
  rightButtons = [],
}: Readonly<ToolbarProps>) {
  const {t, i18n} = useTranslation()
  const {auth, apicTokenExpirationDate} = useMyContext()
  const {isPorgError, porg, hidePorg} = useAPI()

  const currentLanguage = i18n.language
  const displayLanguage =
    LANGUAGE_DISPLAY_NAMES[currentLanguage] || currentLanguage

  async function logout() {
    if (platformAPI.logout) {
      await platformAPI.logout()
    }
  }

  /**
   * Handles new chat and settings button
   * @param buttonName Name of button (either newchat or settings)
   */
  async function onClickButton(buttonName: string) {
    onClickCallback(buttonName)
  }

  let aiContent = (
    <div>
      <p className='secondary pb-1rem'>{t('toolbar.aiExplained')}</p>
      <h3>{t('toolbar.aiAgent')}</h3>
      <p className='secondary pt-1rem pb-1rem'>
        {t('toolbar.accelerateDevelopment')}
      </p>
      <hr />
      <p className='secondary pt-1rem'>{t('toolbar.howItWorks')}</p>
      <p>{t('toolbar.aiCanAssist')}</p>
      <p className='pt-1rem'>
        1. <span className='bold'>{t('toolbar.analyze')}</span>&nbsp;{' '}
        {t('toolbar.analyzeDescription')}
      </p>
      <p className='pb-1rem'>
        2. <span className='bold'>{t('toolbar.recommend')}</span>&nbsp;{' '}
        {t('toolbar.recommendDescription')}
      </p>
      <hr />
      <p className='secondary pt-1rem'>{t('toolbar.baseAiModels')}</p>
      <a
        href={'https://huggingface.co/ibm-granite'}
        target='_blank'
        rel='noreferrer'
      >
        {'Granite'} <Launch />
      </a>
      <p className='secondary pt-1rem'>{t('toolbar.additionalModels')}</p>
      <a
        href={
          'https://huggingface.co/meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8'
        }
        target='_blank'
        rel='noreferrer'
      >
        {'Llama 4 Maverick'} <Launch />
      </a>
      <p className='secondary pt-1rem'>{t('toolbar.additionalDetails')}</p>
      <p>{t('toolbar.baseModelDescription')}</p>
    </div>
  )

  const darkThemeToken = frontendClientType === 'vscode' ? 'g90' : 'g100'

  return (
    <div className='toolbar-container'>
      <Header aria-label='toolbar'>
        <div className='toolbar-sub-item'>
          {!hideToolbarMenu && (
            <OverflowMenu
              align='right'
              renderIcon={() => <Menu />}
              className='agent-ui-overflow-menu'
              menuOptionsClass={`menu-items ${isDarkTheme ? `cds--${darkThemeToken}` : 'cds--white'}`}
            >
              <OverflowMenuItem
                className='agent-ui-menu-item'
                itemText={<div>{t('toolbar.backToChats')}</div>}
                aria-label='back to chats'
                onClick={() => onClickButton('backToLanding')}
                closeMenu={() => {}}
              />

              <OverflowMenuItem
                className='agent-ui-menu-item'
                itemText={<div>{t('toolbar.samplePrompts')}</div>}
                aria-label='sample prompts'
                onClick={() => onClickButton('samplePrompts')}
                closeMenu={() => {}}
              />

              <OverflowMenuItem
                className='agent-ui-menu-item'
                itemText={
                  <div className='menu-sub-item'>
                    {t('toolbar.newChat')}
                    <NewTab className='menuIcon' />
                  </div>
                }
                aria-label='new chat'
                hasDivider
                disabled={isPorgError}
                onClick={() => onClickButton('newchat')}
                closeMenu={() => {}}
              />

              {/* only show for vscode or apistudio clients because apim handles org switch outside chat */}
              {frontendClientType !== 'apim' &&
                frontendClientType !== 'apistudio-embedded' && (
                  <OverflowMenuItem
                    className='agent-ui-menu-item'
                    itemText={<div>{t('toolbar.switchOrganization')}</div>}
                    aria-label='switch org'
                    hasDivider
                    disabled={isPorgError}
                    onClick={() => onClickButton('switchorg')}
                    closeMenu={() => {}}
                  />
                )}

              {/* only used in development */}
              {showCustomHeaderMenuItem && (
                <OverflowMenuItem
                  className='agent-ui-menu-item'
                  itemText={<div>{t('toolbar.updateHttpHeaders')}</div>}
                  aria-label='update headers'
                  onClick={() => onClickButton('updateHeaders')}
                  closeMenu={() => {}}
                />
              )}

              {platformAPI.logout && (
                <OverflowMenuItem
                  className='agent-ui-menu-item'
                  itemText={
                    <div>
                      {t('toolbar.logout')}
                      <Logout className='menuIcon' />
                    </div>
                  }
                  aria-label='logout'
                  hasDivider
                  onClick={() => logout()}
                  closeMenu={() => {}}
                />
              )}

              {/* Custom dropdown buttons */}
              {dropdownButtons.map((button, index) => (
                <OverflowMenuItem
                  key={`dropdown-button-${index}`}
                  className='agent-ui-menu-item'
                  itemText={
                    <div className='menu-sub-item'>
                      <span>{button.label}</span>
                      <button.buttonIcon className='menuIcon' />
                    </div>
                  }
                  aria-label={button.label}
                  onClick={() => button.callback()}
                  closeMenu={() => {}}
                />
              ))}
            </OverflowMenu>
          )}

          <HeaderName
            prefix='IBM'
            color={isDarkTheme ? '#ffffff' : '#000000'}
          >
            {label}
          </HeaderName>
        </div>

        <div className='toolbar-sub-item'>
          {!hidePorg &&
            (porg ||
              (apicTokenExpirationDate === 'indefinite' &&
                auth?.['X-ibm-org'])) && (
              <div className='env-details'>
                <Button
                  kind='ghost'
                  onClick={() => onClickButton('readOnlySettings')}
                >
                  <span className='orgTruncation'>
                    {porg ||
                      (apicTokenExpirationDate === 'indefinite' &&
                        auth?.['X-ibm-org'])}
                  </span>
                </Button>
              </div>
            )}

          <div className='language-indicator'>
            <Tooltip
              align='bottom'
              label={t('chat.languageNotificationMessage', {
                language: displayLanguage,
              })}
            >
              <Button
                kind='ghost'
                size='sm'
                className='language-button'
              >
                {displayLanguage}
              </Button>
            </Tooltip>
          </div>

          {showSidebarButton && (
            <Button
              kind='ghost'
              size='sm'
              hasIconOnly
              iconDescription={sidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
              renderIcon={() => (sidebarOpen ? <Maximize /> : <Minimize />)}
              onClick={() =>
                onClickButton(sidebarOpen ? 'closeSidebar' : 'openSidebar')
              }
              className='sidebar-toggle-button'
            />
          )}

          {/* Custom right-side buttons */}
          {rightButtons.map((button, index) => (
            <Button
              key={`right-button-${index}`}
              kind='ghost'
              size='sm'
              hasIconOnly
              iconDescription={button.label}
              tooltipAlignment='end'
              tooltipPosition='bottom'
              renderIcon={() => <button.buttonIcon />}
              onClick={() => button.callback()}
              className='toolbar-custom-button'
            />
          ))}

          <AILabel
            className='aiSlug'
            size='xs'
          >
            <AILabelContent>{aiContent}</AILabelContent>
          </AILabel>
        </div>
      </Header>
    </div>
  )
}
