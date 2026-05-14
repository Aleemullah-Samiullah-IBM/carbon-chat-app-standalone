// Main barrel export file for @agent-ui/common package
// This allows external consumers to import from '@agent-ui/common'
// while internal packages can still use '@agent-ui/common/src/...' for source imports

// Components
export {McpAuthModal} from './components/McpAuthModal/McpAuthModal'
export {Message} from './components/message/message'
export {LoadingMessage} from './components/message/loadingMessage/loadingMessage'
export {StreamingMessage} from './components/message/streamingMessage/streamingMessage'
export {default as SelectionTable} from './components/message/selectionTable/selectionTable'
export {default as EditPlanPage} from './components/message/plan/editPlanPage'
export {PromptInput} from './components/promptInput/promptInput'
export {default as Toolbar} from './components/toolbar/toolbar'
export {SamplePromptsModal} from './components/samplePrompts/samplePrompts'
export {UpdateHeadersModal} from './components/updateHeaders/updateHeaders'
export {RemoteDomRenderer} from './components/RemoteDomRenderer'
export {default as ApimInstanceSelector} from './components/apimInstanceSelector'
export type {ApimInstance} from './components/apimInstanceSelector'
export {default as ApimEmptyState} from './components/apimEmptyState'
export {default as APIMDisconnectedEmptyState} from './components/apimDisconnectedEmptyState/apimDisconnectedEmptyState'
export * from './components/links'
export * from './components/errorNotification'
export {Block} from './components/block/block'
export {default as PorgPicker} from './components/porgPicker/porgPicker'
export {default as PorgPickerInModal} from './components/porgPicker/porgPickerInModal'
export {default as PorgPickerModal} from './components/porgPicker/porgPickerModal'
export {default as ReadOnlySettingsPage} from './components/readOnlySettingsPage/readOnlySettingsPage'
export {default as LanguageSwitcher} from './components/languageSwitcher'
export {default as I18nDemo} from './components/i18nDemo'

// Contexts
export {ChatProvider, useMyContext, useInput} from './contexts/ChatContext'
export {ErrorProvider, useError} from './contexts/ErrorContext'
export {APIProvider, useAPI} from './contexts/APIContext'

// Services
export {default as ApiService} from './services/apiservice'
export * from './services/http/http'
export * from './services/http/apiFetch'

// Types
export * from './types'

// Utilities
export * from './utilities/helpers'
export {createWelcomeMessage} from './utilities/welcomeMessage'
export * from './utilities/customHeadersStorage'
export * from './utilities/programmaticHeaders'

// Interfaces
export type {FileProvider, FrontendContext} from './interfaces/platform'

// Constants
export * from './constants'

// Icons
export * from './icons/icons'

// i18n
export {default as i18n} from './i18n'
export {useTranslation, Trans} from 'react-i18next'
