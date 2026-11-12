import { defineConfig } from 'vitest/config';
import { TEST_API_URL } from './src/test/constants';

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
    exclude: ['node_modules'],
    // The API host the MSW handlers answer on (src/mocks/utils.ts apiPattern).
    // eslint-disable-next-line @typescript-eslint/naming-convention -- environment variable name set by Expo
    env: { EXPO_PUBLIC_API_URL: TEST_API_URL },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        '**/*.d.ts',
        '**/*.config.*',
        '**/node_modules/**',
        '**/coverage/**',
      ],
    },
  },
});
