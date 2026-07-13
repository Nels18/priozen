import { setupServer } from 'msw/node';
import { apiHandlers } from './apiHandlers';

// React Native (iOS / Android) — via msw/node polyfill
export const server = setupServer(...apiHandlers);
