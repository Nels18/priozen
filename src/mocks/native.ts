import './msw.polyfills';
import { getResponse } from 'msw';
import { apiHandlers } from './apiHandlers';

// React Native (iOS / Android).
//
// Not `setupServer` from 'msw/native': its fetch/XHR interceptors rebuild the
// mocked Response from `response.body` (a ReadableStream), which React
// Native's Response doesn't expose — every mocked body arrived empty.
// Instead, fetch is replaced by a function that resolves the request against
// the handlers directly and returns their Response untouched.
export const installNativeMocks = (): void => {
  const originalFetch = globalThis.fetch;

  const mockedFetch: typeof fetch = async (input, init) => {
    const mocked = await getResponse(apiHandlers, new Request(input, init));
    // No matching handler: let the request through (like onUnhandledRequest: 'bypass').
    return mocked ?? originalFetch(input, init);
  };

  globalThis.fetch = mockedFetch;
};
