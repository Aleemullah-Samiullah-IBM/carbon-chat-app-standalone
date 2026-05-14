import {useTranslation} from 'react-i18next'
import {Button} from '@carbon/react'
import './i18nDemo.scss'

/**
 * Demo component showing how to use react-i18next
 * This component demonstrates:
 * - Basic translation with t()
 * - Interpolation with variables
 * - Language switching
 * - Current language display
 */
export function I18nDemo() {
  const {t, i18n} = useTranslation()

  const languages = [
    {code: 'en', name: 'English'},
    {code: 'es', name: 'Español'},
    {code: 'fr', name: 'Français'},
    {code: 'de', name: 'Deutsch'},
    {code: 'ja', name: '日本語'},
    {code: 'pt-BR', name: 'Português (Brasil)'},
    {code: 'zh', name: '中文'},
  ]

  return (
    <div className='i18n-demo'>
      <h1>{t('common.welcome')}</h1>

      <div className='demo-section'>
        <h2>Current Language: {i18n.language}</h2>
        <p>{t('chat.placeholder')}</p>
      </div>

      <div className='demo-section'>
        <h3>Common Translations:</h3>
        <ul>
          <li>
            <strong>Loading:</strong> {t('common.loading')}
          </li>
          <li>
            <strong>Error:</strong> {t('common.error')}
          </li>
          <li>
            <strong>Success:</strong> {t('common.success')}
          </li>
          <li>
            <strong>Submit:</strong> {t('common.submit')}
          </li>
          <li>
            <strong>Cancel:</strong> {t('common.cancel')}
          </li>
        </ul>
      </div>

      <div className='demo-section'>
        <h3>Interpolation Example:</h3>
        <p>{t('validation.minLength', {min: 5})}</p>
        <p>{t('validation.maxLength', {max: 100})}</p>
      </div>

      <div className='demo-section'>
        <h3>Switch Language:</h3>
        <div className='language-buttons'>
          {languages.map(lang => (
            <Button
              key={lang.code}
              kind={i18n.language === lang.code ? 'primary' : 'secondary'}
              size='sm'
              onClick={() => i18n.changeLanguage(lang.code)}
            >
              {lang.name}
            </Button>
          ))}
        </div>
      </div>

      <div className='demo-section'>
        <h3>Error Messages:</h3>
        <ul>
          <li>{t('errors.generic')}</li>
          <li>{t('errors.network')}</li>
          <li>{t('errors.unauthorized')}</li>
        </ul>
      </div>
    </div>
  )
}

export default I18nDemo

// Made with Bob
