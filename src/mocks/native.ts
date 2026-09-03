import './msw.polyfills';
import { setupServer } from 'msw/native';
import { apiHandlers } from './apiHandlers';

// React Native (iOS / Android) — via msw/native
export const server = setupServer(...apiHandlers);
