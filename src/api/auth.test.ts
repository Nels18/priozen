import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockUser } from '../mocks/data/fixtures';

// Re-import modules per test so the MSW database singleton starts fresh.
let serverModule: typeof import('../mocks/server');
let authModule: typeof import('./auth');
let clientModule: typeof import('./client');

beforeEach(async (): Promise<void> => {
  vi.resetModules();
  vi.stubEnv('EXPO_PUBLIC_API_URL', 'http://test.local');
  serverModule = await import('../mocks/server');
  authModule = await import('./auth');
  clientModule = await import('./client');
  serverModule.server.listen({ onUnhandledRequest: 'error' });
});

afterEach((): void => {
  serverModule.server.close();
  vi.unstubAllEnvs();
});

describe('login', () => {
  it('returns the session for valid credentials', async (): Promise<void> => {
    const session = await authModule.login({
      email: mockUser.email,
      password: 'password123',
    });

    expect(session.token).toBeTruthy();
    expect(session.user.email).toBe(mockUser.email);
  });

  it('throws an ApiError with status 401 for invalid credentials', async (): Promise<void> => {
    const attempt = authModule.login({
      email: mockUser.email,
      password: 'wrong-password',
    });

    await expect(attempt).rejects.toBeInstanceOf(clientModule.ApiError);
    await expect(attempt).rejects.toMatchObject({ status: 401 });
  });
});
