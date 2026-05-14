import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translation files
import enTranslation from './locales/en/translation.json'
import esTranslation from './locales/es/translation.json'
import frTranslation from './locales/fr/translation.json'
import deTranslation from './locales/de/translation.json'
import jaTranslation from './locales/ja/translation.json'
import zhTranslation from './locales/zh/translation.json'
import ptBRTranslation from './locales/pt-BR/translation.json'

// Define available resources
const resources = {
  en: {
    translation: enTranslation,
  },
  es: {
    translation: esTranslation,
  },
  fr: {
    translation: frTranslation,
  },
  de: {
    translation: deTranslation,
  },
  ja: {
    translation: jaTranslation,
  },
  zh: {
    translation: zhTranslation,
  },
  'pt-BR': {
    translation: ptBRTranslation,
  },
}

// Initialize i18next
i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Fallback language if detection fails
    debug: false, // Set to true for development debugging
    
    // Language detection options
    detection: {
      // Order of detection methods
      order: ['navigator', 'localStorage', 'cookie', 'querystring', 'htmlTag'],
      
      // Cache user language preference
      caches: ['localStorage', 'cookie'],
      
      // Cookie options
      cookieMinutes: 10080, // 7 days
      cookieDomain: undefined,
    },
    
    // Interpolation options
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    // React options
    react: {
      useSuspense: false, // Set to true if you want to use Suspense
    },
    
    // Supported languages
    supportedLngs: ['en', 'es', 'fr', 'de', 'ja', 'zh', 'pt-BR'],
    
    // Namespace configuration
    ns: ['translation'],
    defaultNS: 'translation',
  })

// Expose i18n to window for debugging/testing
if (typeof window !== 'undefined') {
  (window as any).i18n = i18n
}

export default i18n

// Made with Bob
