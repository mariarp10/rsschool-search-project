import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
  ],

  resolve: {
    alias: {
      '@ui': new URL('src/components/ui', import.meta.url).pathname,
      '@utils': new URL('src/utils', import.meta.url).pathname,
      '@components': new URL('src/components', import.meta.url).pathname,
      '@pages': new URL('src/pages', import.meta.url).pathname,
      '@tests': new URL('./__tests__', import.meta.url).pathname,
      '@hooks': new URL('src/hooks', import.meta.url).pathname,
      '@routes': new URL('src/routes', import.meta.url).pathname,
      '@assets': new URL('src/assets', import.meta.url).pathname,
    },
  },

  test: {
    environment: 'jsdom',
    setupFiles: './__tests__/setup.js',
    globals: true,

    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],

      include: ['src/**/*.{tsx,ts}'],

      exclude: ['src/main.tsx', 'src/App.tsx', 'src/routes/**'],

      thresholds: {
        statements: 80,
        branches: 50,
        functions: 50,
        lines: 50,
      },
    },
  },
});
