import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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
