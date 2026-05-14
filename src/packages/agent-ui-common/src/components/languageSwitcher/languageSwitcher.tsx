import {useTranslation} from 'react-i18next'
import {Dropdown} from '@carbon/react'
import {
  SUPPORTED_LANGUAGES,
  LANGUAGE_LOCALE_MAP,
  LanguageOption,
} from '../../constants'

interface LanguageSwitcherProps {
  apiConfig?: {
    hostUrl?: string
    token?: string
  }
  onLanguageChange?: (language: string) => void
  onError?: (error: string) => void
  className?: string
  titleText?: string
}

export const LanguageSwitcher = ({
  apiConfig,
  onLanguageChange,
  onError,
  className = '',
  titleText = '',
}: LanguageSwitcherProps) => {
  const {i18n} = useTranslation()

  const handleLanguageChange = async (event: {
    selectedItem: LanguageOption | null
  }) => {
    if (!event.selectedItem) return

    const selectedItem = event.selectedItem

    // update ui language
    i18n.changeLanguage(selectedItem.id)

    // inform parent component
    if (onLanguageChange) {
      onLanguageChange(selectedItem.label)
    }

    // update backend language_locale if apiConfig is provided
    // otherwise only ui translations are done
    if (apiConfig?.hostUrl) {
      const backendLocale =
        LANGUAGE_LOCALE_MAP[selectedItem.id] || selectedItem.id

      try {
        const response = await fetch(
          `${apiConfig.hostUrl}/api/language-locale`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(apiConfig.token && {
                Authorization: `Bearer ${apiConfig.token}`,
              }),
            },
            body: JSON.stringify({
              language_locale: backendLocale,
            }),
          },
        )

        if (!response.ok) {
          const errorMessage = `Failed to update language locale in backend: ${response.status} ${response.statusText}`
          console.error(errorMessage)
          if (onError) {
            onError(errorMessage)
          }
        } else {
          const data = await response.json()
          console.log('Language locale updated:', data)
        }
      } catch (error) {
        const errorMessage = `Error updating language locale: ${error instanceof Error ? error.message : String(error)}`
        console.error(errorMessage)
        if (onError) {
          onError(errorMessage)
        }
      }
    }
  }

  const currentLanguage =
    SUPPORTED_LANGUAGES.find(lang => lang.id === i18n.language)?.label ||
    'English'

  return (
    <Dropdown
      id='language-selector'
      titleText={titleText}
      label={currentLanguage}
      items={SUPPORTED_LANGUAGES}
      itemToString={(item: LanguageOption | null) => (item ? item.label : '')}
      onChange={handleLanguageChange}
      className={className}
    />
  )
}

export default LanguageSwitcher
