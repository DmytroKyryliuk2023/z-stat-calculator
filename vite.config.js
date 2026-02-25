import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/e2e/**', // Виключаємо E2E тести
      '**/playwright/**',
      '**/*.spec.js', // Виключаємо Playwright spec файли
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.js',
        '**/*.test.jsx',
        '**/e2e/**',
      ],
    },
  },
});