import { delay } from 'msw';
import { Platform } from 'react-native';

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
    // iOS / Android — msw/native + polyfills
    const { server } = await import('./native');
    server.listen({ onUnhandledRequest: 'bypass' });
  }
};
