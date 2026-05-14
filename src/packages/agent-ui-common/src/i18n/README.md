# Internationalization (i18n) with react-i18next

This project uses `react-i18next` for internationalization support. The implementation automatically detects the user's browser language and provides translations in multiple languages.

## Supported Languages

- English (en) - Default
- Spanish (es)
- French (fr)
- German (de)
- Japanese (ja)
- Chinese (zh)
- Brazilian Portuguese (pt-BR)

## Usage

### Basic Translation Hook

```tsx
import {useTranslation} from '@agent-ui/common'

function MyComponent() {
  const {t} = useTranslation()

  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <p>{t('chat.placeholder')}</p>
    </div>
  )
}
```

### Translation with Variables (Interpolation)

```tsx
import {useTranslation} from '@agent-ui/common'

function GreetingComponent({name}: {name: string}) {
  const {t} = useTranslation()

  return <p>{t('validation.minLength', {min: 5})}</p>
}
```

### Using the Trans Component for Complex Translations

```tsx
import {Trans} from '@agent-ui/common'

function ComplexComponent() {
  return (
    <Trans i18nKey='welcome.message'>
      Welcome to <strong>our app</strong>!
    </Trans>
  )
}
```

### Language Switcher Component

A pre-built language switcher component is available:

```tsx
import {LanguageSwitcher} from '@agent-ui/common'

function App() {
  return (
    <div>
      <LanguageSwitcher />
      {/* Your app content */}
    </div>
  )
}
```

### Programmatic Language Change

```tsx
import {useTranslation} from '@agent-ui/common'

function LanguageButton() {
  const {i18n} = useTranslation()

  const changeToSpanish = () => {
    i18n.changeLanguage('es')
  }

  return <button onClick={changeToSpanish}>Cambiar a Español</button>
}
```

### Get Current Language

```tsx
import {useTranslation} from '@agent-ui/common'

function CurrentLanguageDisplay() {
  const {i18n} = useTranslation()

  return <p>Current language: {i18n.language}</p>
}
```

## Translation File Structure

Translation files are located in `packages/common/src/i18n/locales/[language]/translation.json`

Example structure:

```json
{
  "common": {
    "welcome": "Welcome",
    "loading": "Loading..."
  },
  "chat": {
    "placeholder": "Type your message...",
    "send": "Send"
  },
  "errors": {
    "generic": "Something went wrong"
  }
}
```

## Adding New Translations

1. Add the translation key to all language files in `packages/common/src/i18n/locales/*/translation.json`
2. Use the translation key in your component with `t('category.key')`

Example:

```json
// en/translation.json
{
  "myFeature": {
    "title": "My Feature",
    "description": "This is my feature"
  }
}
```

```tsx
// In your component
const {t} = useTranslation()
return <h1>{t('myFeature.title')}</h1>
```

## Language Detection

The system automatically detects the user's language in the following order:

1. **Browser language** (`navigator.language`)
2. **localStorage** (previously saved preference)
3. **Cookie** (if set)
4. **Query string** (`?lng=es`)
5. **Fallback** to English if none detected

The detected language is automatically saved to localStorage and cookies for future visits.

## TypeScript Support

The project includes TypeScript definitions for type-safe translations. The types are automatically inferred from the English translation file.

```tsx
// TypeScript will autocomplete and validate translation keys
const {t} = useTranslation()
t('common.welcome') // ✅ Valid
t('common.invalid') // ❌ TypeScript error
```

## Configuration

The i18n configuration is located in `packages/common/src/i18n/config.ts`. You can modify:

- Supported languages
- Fallback language
- Detection order
- Cache settings
- Debug mode

## Best Practices

1. **Use nested keys** for better organization: `t('chat.placeholder')` instead of `t('chatPlaceholder')`
2. **Keep translations consistent** across all language files
3. **Use interpolation** for dynamic content: `t('greeting', { name: 'John' })`
4. **Avoid hardcoded strings** - always use translation keys
5. **Test with different languages** to ensure UI layout works properly

## Example: Migrating Hardcoded Strings

Before:

```tsx
function Button() {
  return <button>Submit</button>
}
```

After:

```tsx
import {useTranslation} from '@agent-ui/common'

function Button() {
  const {t} = useTranslation()
  return <button>{t('common.submit')}</button>
}
```

## Troubleshooting

### Translations not loading

- Ensure i18n is initialized in your app's entry point (`main.tsx`)
- Check that translation files exist for the language
- Verify the translation key exists in the JSON file

### Language not changing

- Check browser console for errors
- Verify the language code is in the `supportedLngs` array
- Clear localStorage/cookies and try again

### TypeScript errors

- Ensure `resolveJsonModule` is enabled in `tsconfig.json`
- Check that all translation files are included in the TypeScript compilation
