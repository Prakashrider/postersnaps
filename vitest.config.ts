import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    testTimeout: 15000, // 15 seconds for OpenAI API calls
    hookTimeout: 15000, // 15 seconds for setup/teardown
  },
  resolve: {
    alias: {
      '@shared': resolve(__dirname, './shared'),
    },
  },
});
