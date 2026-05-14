/// <reference types="vitest" />
import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setup.ts',
    coverage: {
      provider: 'v8',
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/*.d.ts',
        '**/types/index.ts',
        '**/*.test.{ts,tsx}',
        '**/*.config.{ts,js}',
        '**/tests/**',
        '**/*TestHelpers.{ts,tsx}',
        '**/sharedTestHelpers.{ts,tsx}',
        '**/sharedMockComponents.{ts,tsx}',
      ],
    },
  },
})

// Made with Bob
