import { defineConfig } from 'vitest/config'

// The tests run node classes and transformers through a headless editor;
// no React client components are involved, so no react plugin is needed.
export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.ts'],
  },
})
