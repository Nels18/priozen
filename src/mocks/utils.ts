import { delay } from 'msw';
import { Platform } from 'react-native';

export const DAY_MS = 24 * 60 * 60 * 1000;

// MSW URL pattern for an API path, limited to the API host
// (EXPO_PUBLIC_API_URL). A pattern starting with a "*" wildcard would also
// catch the app's own files: the lazy-loaded bundle of
// app/(protected)/tasks/new.tsx ends in /tasks/new.bundle, which the
// "any host + /tasks/:id" handler answered with a 404.
export const apiPattern = (path: string): string =>
  `${process.env.EXPO_PUBLIC_API_URL ?? ''}${path}`;

export const randomDelay = (min = 200, max = 800): Promise<void> => {
  if (process.env.NODE_ENV === 'test') return Promise.resolve();
  return delay(Math.floor(Math.random() * (max - min) + min));
};

export const createId = (prefix: string): string =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const randomBool = (p = 0.7): boolean => Math.random() < p;

export const startMocks = async (): Promise<void> => {
  if (Platform.OS === 'web') {
    const { worker } = await import('./worker');
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: { url: '/mockServiceWorker.js' },
    });
  } else {
    // iOS / Android — see native.ts for why this isn't msw/native
    const { installNativeMocks } = await import('./native');
    installNativeMocks();
  }
};
