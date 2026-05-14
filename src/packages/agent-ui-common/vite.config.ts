import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*'],
      exclude: ['**/*.test.ts', '**/*.test.tsx', 'src/tests/**/*'],
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'AgentUICommon',
      fileName: format => `agent-ui-common.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      // externalize dependencies that shouldn't be bundled
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@carbon/react',
        '@carbon/icons-react',
        '@carbon/pictograms-react',
        '@carbon/ibm-products',
        '@mcp-ui/client',
        'axios',
        'classnames',
        'i18next',
        'react-i18next',
        'i18next-browser-languagedetector',
        'js-yaml',
        'jwt-decode',
        'lodash',
        'react-markdown',
        'rehype-raw',
        'remark-gfm',
      ],
      output: {
        // Global variables to use in UMD build for externalized deps
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'ReactJsxRuntime',
          '@carbon/react': 'CarbonReact',
          '@carbon/icons-react': 'CarbonIconsReact',
          '@carbon/pictograms-react': 'CarbonPictogramsReact',
          '@carbon/ibm-products': 'CarbonIbmProducts',
          '@mcp-ui/client': 'McpUiClient',
          axios: 'axios',
          classnames: 'classNames',
          i18next: 'i18next',
          'react-i18next': 'ReactI18next',
          'i18next-browser-languagedetector': 'i18nextBrowserLanguageDetector',
          'js-yaml': 'jsyaml',
          'jwt-decode': 'jwtDecode',
          lodash: '_',
          'react-markdown': 'ReactMarkdown',
          'rehype-raw': 'rehypeRaw',
          'remark-gfm': 'remarkGfm',
        },
        // Preserve CSS imports
        assetFileNames: assetInfo => {
          if (assetInfo.name === 'style.css') return 'agent-ui-common.css'
          return assetInfo.name || 'assets/[name]-[hash][extname]'
        },
      },
    },
    // Ensure CSS is extracted to a separate file
    cssCodeSplit: false,
    sourcemap: true,
  },
  // combat noisy warnings in node_modules
  // @carbon/react issue: https://github.com/carbon-design-system/carbon/issues/16962
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
      },
    },
  },
})
