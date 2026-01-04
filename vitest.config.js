import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    globals: true,
    css: true,
    // Exclude Playwright e2e tests from Vitest
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache', 'e2e/**/*'],
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts',
        '**/index.js',
        'src/main.jsx',
        'src/App.jsx',
        'e2e/**',
      ],
      // Coverage thresholds - will fail CI if not met
      thresholds: {
        // Start with reasonable minimums, increase as coverage improves
        statements: 20,
        branches: 15,
        functions: 20,
        lines: 20,
      },
    },
  },
});

