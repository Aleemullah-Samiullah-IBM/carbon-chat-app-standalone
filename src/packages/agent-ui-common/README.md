# @agent-ui/common

Shared UI components and utilities for building Agent UI applications. This package provides reusable, product-agnostic components for creating conversational AI interfaces.

## Installation

> **Note**: The npm package is not yet published to the public registry. Use the tarball method below until official publication.

### Method 1: Using Tarball (Recommended)

1. **Create the tarball**:

   ```bash
   cd packages/common
   npm pack
   ```

   This creates `agent-ui-common-1.0.0.tgz`

2. **Install in your project**:

   ```bash
   npm install /path/to/agent-ui-common-1.0.0.tgz
   ```

3. **Add to package.json**:
   ```json
   {
     "dependencies": {
       "@agent-ui/common": "file:../common/agent-ui-common-1.0.0.tgz"
     }
   }
   ```

### Method 2: From Artifactory (Future)

```bash
# Configure registry
npm config set @apic:registry https://na.artifactory.swg-devops.com/artifactory/api/npm/apic-prod-npm/

# Install package
npm install @agent-ui/common
```

> **Note**: Artifactory package not yet available as of April 2026.

## Usage

### Basic Import (Recommended)

Import '@agent-ui/common/style.css' to your main app file to ensure all common component styles are loaded

Import compiled components from the main entry point:

```typescript
import {
  // Providers
  APIProvider,
  ChatProvider,
  ErrorProvider,

  // Components
  Message,
  LoadingMessage,
  PromptInput,
  Toolbar,

  // Hooks
  useMyContext,
  useAPI,
  useError,
} from '@agent-ui/common'
```

### Source Imports (Monorepo Development)

For faster development within the monorepo, import directly from source:

```typescript
import {Message} from '@agent-ui/common/src/components/message/message'
import {useMyContext} from '@agent-ui/common/src/contexts/ChatContext'
```

> **Warning**: Source imports are not stable for external use and may break in future versions.

## Available Exports

### Components

| Component                    | Description                         |
| ---------------------------- | ----------------------------------- |
| `APIMDisconnectedEmptyState` | APIM disconnected empty state       |
| `ApimEmptyState`             | APIM empty state                    |
| `ApimInstanceSelector`       | APIM instance selector              |
| `Block`                      | Block component                     |
| `DocumentationLink`          | Documentation link component        |
| `EditPlanPage`               | Edit plan page component            |
| `ErrorNotification`          | Error notification component        |
| `I18nDemo`                   | Internationalization demo component |
| `LanguageSwitcher`           | Language switcher component         |
| `LearnMoreLink`              | Learn more link component           |
| `LoadingMessage`             | Loading state message               |
| `McpAuthModal`               | MCP authentication modal            |
| `Message`                    | Main message component              |
| `PorgPicker`                 | PORG picker component               |
| `PorgPickerInModal`          | PORG picker in modal                |
| `PorgPickerModal`            | PORG picker modal                   |
| `PromptInput`                | Input component for prompts         |
| `ReadOnlySettingsPage`       | Read-only settings page             |
| `RemoteDomRenderer`          | Remote DOM renderer                 |
| `SamplePromptsModal`         | Sample prompts modal                |
| `SelectionTable`             | Selection table component           |
| `StreamingMessage`           | Streaming message component         |
| `Toolbar`                    | Toolbar component                   |
| `UpdateHeadersModal`         | Update headers modal                |

### Contexts & Hooks

| Export          | Description                  |
| --------------- | ---------------------------- |
| `ChatProvider`  | Chat context provider        |
| `useMyContext`  | Hook to access chat context  |
| `useInput`      | Hook for input management    |
| `ErrorProvider` | Error context provider       |
| `useError`      | Hook to access error context |
| `APIProvider`   | API context provider         |
| `useAPI`        | Hook to access API context   |

### Services

- `ApiService` - Main API service class
- HTTP utilities from `./services/http/http`
- API fetch utilities from `./services/http/apiFetch`

### Types

All TypeScript types exported from `./types`:

- `Message`, `Command`, `Plan`, `Selection`, `FileData`, `User`, `ErrorRemediation`, `POrgName`

### Utilities

- Helper functions from `./utilities/helpers`
- `createWelcomeMessage` - Create welcome message utility
- Custom headers storage utilities
- Programmatic headers utilities - see [Programmatic Headers Guide](#programmatic-headers-guide)
  - `parseProgrammaticHeaders` - Parse headers from env variables
  - `createProgrammaticHeaders` - Create headers from object
  - `mergeProgrammaticHeaders` - Merge multiple header sources

### Other Exports

- **Constants**: All constants from `./constants`
- **Icons**: All icons from `./icons/icons`
- **i18n**: Internationalization support (`i18n`, `useTranslation`, `Trans`)
- **Interfaces**: `FileProvider`, `FrontendContext`

## Package Structure

```
@agent-ui/common/
├── dist/              # Compiled output (generated by build)
│   ├── index.js       # Main entry point
│   ├── index.d.ts     # TypeScript declarations
│   └── ...
├── src/               # Source files
│   ├── components/    # UI components
│   ├── contexts/      # React contexts
│   ├── services/      # API and HTTP services
│   ├── types/         # TypeScript types
│   ├── utilities/     # Helper functions
│   ├── constants.ts   # Constants
│   ├── icons/         # Icon components
│   └── i18n/          # Internationalization
└── package.json
```

## Development

### Building

```bash
cd packages/common
npm run build
```

### Clean Build

```bash
npm run clean
npm run build
```

### Creating Package Archive

```bash
npm pack
```

## Example Usage

```typescript
import React from 'react'
import {
  APIProvider,
  ChatProvider,
  ErrorProvider,
  Message,
  PromptInput,
  Toolbar,
  useMyContext,
} from '@agent-ui/common'

function ChatApp() {
  return (
    <ErrorProvider>
      <APIProvider>
        <ChatProvider>
          <ChatInterface />
        </ChatProvider>
      </APIProvider>
    </ErrorProvider>
  )
}

function ChatInterface() {
  const {messages, sendMessage} = useMyContext()

  return (
    <div>
      <Toolbar />
      <div className="messages">
        {messages.map(msg => (
          <Message key={msg.id} message={msg} />
        ))}
      </div>
      <PromptInput onSend={sendMessage} />
    </div>
  )
}

export default ChatApp
```

## Configuration

### TypeScript

The package uses ESNext modules:

- **Module**: ESNext
- **Target**: ESNext
- **JSX**: react-jsx
- **Declaration**: true (generates .d.ts files)
- **Declaration Maps**: true (for IDE support)

### Peer Dependencies

Required in your project:

- `react` ^18.0.0
- `react-dom` ^18.0.0

### Dependencies

Key dependencies included:

- `@carbon/react` - Carbon Design System
- `@carbon/icons-react` - Carbon icons
- `axios` - HTTP client
- `react-markdown` - Markdown rendering
- `react-i18next` - Internationalization

See `package.json` for complete list.

## 🐛 Troubleshooting

### Import Errors

**Problem**: "Module not found" errors

**Solutions**:

1. Ensure package is built: `npm run build` in `packages/common`
2. Use correct import path: `@agent-ui/common` (not `@agent-ui/common/dist`)
3. Verify `package.json` exports point to `./dist/index.js`

### TypeScript Errors

**Problem**: Can't find type definitions

**Solutions**:

1. Ensure `dist/index.d.ts` exists (run `npm run build`)
2. Check `tsconfig.json` has proper module resolution
3. Verify package is installed in `node_modules`

### Monorepo Development

For faster development without rebuilding:

1. Use source imports: `@agent-ui/common/src/*`
2. TypeScript will compile source files directly
3. Avoid rebuilding after every change

## Publishing

```bash
npm publish
```

The `prepublishOnly` script automatically cleans and builds before publishing.

# Programmatic Headers Guide

This guide explains how to configure application-specific HTTP headers that are automatically attached to every API request.

## Overview

The `@agent-ui/common` package supports three levels of custom headers:

1. **Programmatic Headers** (Lowest Priority) - Set at application initialization via environment variables or configuration
2. **UI-Configured Headers** (Highest Priority) - Set by users through the "Update Headers" modal in the UI

Headers are merged with the following priority (highest to lowest):

1. UI-configured headers (from localStorage)
2. Programmatic headers (from environment/config)
3. Default headers (from ApiService)

## Use Cases

Programmatic headers are ideal for:

- Application-specific identifiers (e.g., `X-ibm-org-id`, `X-ibm-catalog-id`)
- Environment-specific configuration
- Headers that should be consistent across all users of an application
- Headers that don't need to be changed by end users

## Configuration Methods

### Method 1: Environment Variables

**Step 1:** Add headers to your `.env` file using the `VITE_CUSTOM_HEADER_` prefix:

```bash
# .env
VITE_CUSTOM_HEADER_X_IBM_ORG_ID=my-org-123
VITE_CUSTOM_HEADER_X_IBM_CATALOG_ID=my-catalog-456
VITE_CUSTOM_HEADER_X_CUSTOM_APP_ID=my-appy
```

**Step 2:** Parse the headers and pass them to `configureService`:

```typescript
import {parseProgrammaticHeaders} from '@agent-ui/common'

// Parse headers from environment variables
const headers = parseProgrammaticHeaders(import.meta.env)

// Pass to configureService
configureService(
  hostUrl,
  apiBasePath,
  token,
  user,
  org,
  frontendContext,
  authContext,
  headers, // programmatic headers
)
```

**Naming Convention:**

- Prefix: `VITE_CUSTOM_HEADER_`
- Header name in UPPER_SNAKE_CASE
- Will be converted to proper HTTP header format (Kebab-Case)

**Examples:**

- `VITE_CUSTOM_HEADER_X_IBM_ORG_ID` -> `X-ibm-org-id`
- `VITE_CUSTOM_HEADER_X_CUSTOM_APP_ID` -> `X-custom-app`

### Method 2: Direct Configuration

**Step 1:** Create headers programmatically using `createProgrammaticHeaders`:

```typescript
import {createProgrammaticHeaders} from '@agent-ui/common'

// Create headers directly from an object
const headers = createProgrammaticHeaders({
  'X-ibm-org-id': 'my-org-123',
  'X-ibm-catalog-id': 'my-catalog-456',
})
```

**Step 2:** Pass the headers to `configureService`:

```typescript
configureService(
  hostUrl,
  apiBasePath,
  token,
  user,
  org,
  frontendContext,
  authContext,
  headers, // programmatic headers
)
```

## Implementation Example

### Web Sample Application

**1. Update `.env` file:**

```bash
# API Configuration
VITE_HOST_URL=http://localhost:8123
VITE_TOKEN=your_token
VITE_USER=your_user
VITE_ORG=your_org

# Custom Headers
VITE_CUSTOM_HEADER_X_IBM_ORG_ID=org-12345
VITE_CUSTOM_HEADER_X_IBM_CATALOG_ID=catalog-67890
```

**2. Parse headers in App.tsx:**

```typescript
import {parseProgrammaticHeaders} from '@agent-ui/common'

const programmaticHeaders = parseProgrammaticHeaders(import.meta.env)

const config = {
  hostUrl: import.meta.env.VITE_HOST_URL,
  token: import.meta.env.VITE_TOKEN,
  user: import.meta.env.VITE_USER,
  org: import.meta.env.VITE_ORG,
  programmaticHeaders,
}
```

**3. Pass to ChatPane:**

```typescript
<ChatPane
  apiConfig={config}
  // ... other props
/>
```

**4. Configure API service:**

```typescript
configureService(
  apiConfig.hostUrl,
  '',
  apiConfig.token,
  apiConfig.user,
  apiConfig.org,
  frontendContext,
  authContext,
  apiConfig.programmaticHeaders,
)
```

## API Reference

### `parseProgrammaticHeaders(env, prefix?)`

Parses environment variables into header objects.

**Parameters:**

- `env: Record<string, any>` - Environment variables object (e.g., `import.meta.env`)
- `prefix?: string` - Prefix for header variables (default: `'VITE_CUSTOM_HEADER_'`)

**Returns:** `Record<string, string>` - Parsed headers

**Example:**

```typescript
const headers = parseProgrammaticHeaders(import.meta.env)
// { 'X-ibm-org-id': 'value', 'X-custom-header': 'value' }
```

### `createProgrammaticHeaders(headers)`

Creates validated headers from an object.

**Parameters:**

- `headers: Record<string, string | undefined>` - Header key-value pairs

**Returns:** `Record<string, string>` - Validated headers (empty/undefined values removed)

**Example:**

```typescript
const headers = createProgrammaticHeaders({
  'X-ibm-org-id': 'org-123',
  'X-empty': '', // Will be filtered out
  'X-undefined': undefined, // Will be filtered out
})
// { 'X-ibm-org-id': 'org-123' }
```

### `mergeProgrammaticHeaders(...sources)`

Merges multiple header sources with priority.

**Parameters:**

- `...sources: Array<Record<string, string> | undefined>` - Header objects to merge

**Returns:** `Record<string, string>` - Merged headers (later sources override earlier ones)

**Example:**

```typescript
const merged = mergeProgrammaticHeaders(
  {header1: 'value1'},
  {header2: 'value2'},
  {header1: 'override'}, // Overrides first header1
)
// { header1: 'override', header2: 'value2' }
```

## Header Priority and Merging

When multiple header sources are present, they are merged in this order:

1. **Default headers** (from ApiService constructor)
   - `Authorization`, `Content-Type`, `X-ibm-user`, `X-ibm-org`, etc.

2. **Programmatic headers** (from environment/config)
   - Set at application initialization
   - Cannot be changed by end users

3. **UI-configured headers** (from localStorage)
   - Set through the "Update Headers" modal
   - Highest priority - can override any header

**Example:**

```typescript
// Default headers
{
  'Authorization': 'Bearer token123',
  'X-ibm-user': 'user@example.com',
}

// + Programmatic headers
{
  'X-ibm-organization-id': 'org-123',
  'X-ibm-catalog-id': 'catalog-456',
}

// + UI-configured headers
{
  'Authorization': 'Bearer custom-token', // Overrides default
  'X-custom-header': 'custom-value',
}

// = Final headers sent with request
{
  'Authorization': 'Bearer custom-token', // From UI (highest priority)
  'X-ibm-user': 'user@example.com', // From default
  'X-ibm-organization-id': 'org-123', // From programmatic
  'X-ibm-catalog-id': 'catalog-456', // From programmatic
  'X-custom-header': 'custom-value', // From UI
}
```

## Troubleshooting

### Headers Not Being Sent

1. **Check environment variable naming:**

   ```bash
   # ✅ Correct
   VITE_CUSTOM_HEADER_X_IBM_ORG_ID=value

   # ❌ Wrong (missing prefix)
   X_IBM_ORG_ID=value
   ```

2. **Verify headers are parsed:**

   ```typescript
   const headers = parseProgrammaticHeaders(import.meta.env)
   console.log('Programmatic headers:', headers)
   ```

3. **Check headers are passed to configureService:**
   ```typescript
   configureService(
     // ... other params
     programmaticHeaders, // Make sure this is included
   )
   ```

### Headers Being Overridden

- UI-configured headers have highest priority
- Check localStorage for custom headers: `localStorage.getItem('custom_http_headers')`
- Clear UI headers if needed: `localStorage.removeItem('custom_http_headers')`

### API Calls Being Rejected

If API calls are being rejected after adding custom headers:

- **Check if the backend server accepts custom headers:**
  - Some servers may reject requests with unrecognized custom headers
  - Backend changes may be needed to whitelist or handle the custom headers
  - Verify CORS configuration allows the custom headers
  - Check server logs for header-related errors

### Environment Variables Not Loading

- Ensure `.env` file is in the correct directory
- Restart development server after changing `.env`
- Verify Vite is configured to load environment variables
- Check that variables start with `VITE_` prefix

## Migration from UI-Only Headers

If you're currently using only UI-configured headers and want to move some to programmatic headers:

1. **Identify headers that should be programmatic:**
   - Application-wide constants
   - Environment-specific values
   - Headers that don't need user modification

2. **Add to `.env` file:**

   ```bash
   VITE_CUSTOM_HEADER_X_IBM_ORG_ID=your-org-id
   ```

3. **Update application initialization:**

   ```typescript
   const programmaticHeaders = parseProgrammaticHeaders(import.meta.env)
   // Pass to configureService
   ```

4. **Remove from UI configuration:**
   - Users can remove these from the "Update Headers" modal
   - They'll now come from programmatic configuration

## See Also

- [API Service Documentation](./src/services/apiservice.ts)
- [Custom Headers Storage](./src/utilities/customHeadersStorage.ts)
- [Web Sample README](../web-sample/README.md)

# How to make updates to your existing UI to use CommonAgentUI

Most changes should be scoped to the following files:

- web-app ==> ChatPane.tsx
- vscode-plugin ==> conversationPane.tsx, apigenie.tsx

Steps to make changes:

1. npm install <package>/ you can use a local copy of the common tar file til then, essentially the same thing - I attached the latest below. Point your npm dependencies to it
2. remove the nested common package in agent-ui
3. update vite.config.ts, ts.config.json to point to right place
4. you will now use common from the tar file
5. update all imports in vscode-plugin and web-app to the package's now, follow this guide above, e.g. `import {APIProvider, Message, useMyContext}from '@agent-ui/common'` or keep as is. Work on web-app first. it's more straightforward
   vscode-plugin solution WIP in CommonAgentUI. You can reference once complete.
6. To pick up streaming services, please reference my /package/web-sample. Replace postChat with streamChat plus on the callbacks.
7. possible minor layout styling upgrades
8. common is agnostic now, so might need some minor updates to pass in the title and such specific for API Connect, for example pass title into Toolbar and sample prompts into SamplePrompts via the ui-config.json. Use CommonAgentUI web-sample as the reference: https://github.ibm.com/AgentVerse/CommonAgentUI/tree/main/packages/web-sample. They are mostly the same thing.
9. general testing to make sure everything works as expected
10. FYI name of the package could be renamed to conform to artifactory standards, so everything might need to be renamed

## 📄 License

See the main repository [LICENSE](../../LICENSE) file.

## 🤝 Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) in the root of the repository.

## 🔗 Related Documentation

- [Root README](../../README.md) - Monorepo overview
- [Web Sample](../web-sample/README.md) - Demo application
- [Migration Guide](../../MIGRATION_GUIDE.md) - Upgrade instructions
