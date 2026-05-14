export const AGENT_CONFIGURING_URL_OPREM =
  'https://www.ibm.com/docs/en/SSMNED_12.1.x_cd/com.ibm.apic.assistant.doc/configure_apiagent_apimgmt.html'
export const AGENT_CONFIGURING_URL_AWS =
  'https://www.ibm.com/docs/SSCL05_preview/com.ibm.apic.assistant.doc/configure_apiagent_apimgmt.html'
export const AGENT_GETTING_STARTED_URL_OPREM =
  'https://www.ibm.com/docs/en/SSMNED_12.1.x_cd/com.ibm.apic.assistant.doc/getting_started.html'
export const AGENT_GETTING_STARTED_URL_AWS =
  'https://www.ibm.com/docs/SSCL05_preview/com.ibm.apic.assistant.doc/getting_started.html'
export const PORG_ERROR_MESSAGE =
  'You are not part of any provider organizations which have API Agent enabled, or you do not have permission to use API Agent in any provider organization which have API Agent enabled in API Manager. Please contact your admin to enable.'
export const FETCH_ORGS_ERROR_MESSAGE =
  'Unable to fetch provider organizations. This might be due to network issue or the Agent not being enabled. Please refresh the chat, and contact your administrator if the issue continues.'

// Language configuration
export interface LanguageOption {
  id: string
  label: string
}

// All supported languages in the application
export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {id: 'en', label: 'English'},
  // {id: 'es', label: 'Español'},
  // {id: 'de', label: 'Deutsch'},
  {id: 'fr', label: 'Français'},
  {id: 'ja', label: '日本語'},
  // {id: 'pt-BR', label: 'Português (Brasil)'},
  // {id: 'zh', label: '中文'},
  {id: 'ar', label: 'العربية'},
]

// Map UI language codes to backend locale codes
export const LANGUAGE_LOCALE_MAP: Record<string, string> = {
  en: 'en-US',
  // es: 'es',
  // de: 'de',
  fr: 'fr-CA',
  // 'pt-BR': 'pt-BR',
  ja: 'ja-JP',
  ar: 'ar-SA',
  // zh: 'zh',
}

// Language display names mapping for quick lookup
export const LANGUAGE_DISPLAY_NAMES: Record<string, string> =
  SUPPORTED_LANGUAGES.reduce(
    (acc, lang) => {
      acc[lang.id] = lang.label
      return acc
    },
    {} as Record<string, string>,
  )
