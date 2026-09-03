import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: [
      // react-native's source uses Flow syntax that Vitest can't parse;
      // react-native-web is plain, pre-compiled JS and covers what our
      // mocks/tests need (e.g. Platform.OS).
      { find: 'react-native', replacement: 'react-native-web' },
    ],
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'app-example/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        '**/*.d.ts',
        '**/*.config.*',
        '**/node_modules/**',
        '**/coverage/**',
        'app-example/**',
      ],
    },
  },
});
