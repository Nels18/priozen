import './msw.polyfills';
import { setupServer } from 'msw/native';
import { apiHandlers } from './apiHandlers';

// React Native (iOS / Android) — via msw/node polyfill
export const server = setupServer(...apiHandlers);
