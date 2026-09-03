import { setupServer } from 'msw/node';
import { apiHandlers } from './apiHandlers';

// Vitest test environment
export const server = setupServer(...apiHandlers);
