import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@ui': path.resolve(__dirname, 'src/components/ui'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@tests': path.resolve(__dirname, './__tests__'),
    },
  },

  test: {
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
    globals: true,

    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],

      include: ['src/**/*.tsx'],

      exclude: [
        'src/**/*.test.ts',
        'src/main.tsx',
        'src/error-messages.ts',
        'src/components/**/index.ts',
        'src/components/ui/**',
        'src/tests/**',
      ],

      thresholds: {
        statements: 80,
        branches: 50,
        functions: 50,
        lines: 50,
      },
    },
  },
});
