import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@agent-ui/common': path.resolve(__dirname, 'node_modules/@agent-ui/common/src'),
    },
  },
  // combat noisy warnings in node_modules
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
      },
    },
  },
})

// Made with Bob
