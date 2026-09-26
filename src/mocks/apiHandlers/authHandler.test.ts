import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { authRoutes } from '../../api/routes';
import { makeDumbUser } from '../factories/userFactory';

// Each test re-imports the mock server so the underlying database singleton
// starts from the seeded fixtures instead of leaking state across tests.
let serverModule: typeof import('../server');

const VALID_PASSWORD = 'password123';
const BASE_URL = 'http://test.local';
const expectedUser = makeDumbUser();
const MOCK_TOKEN = 'mock-jwt-token-priozen-dev';

beforeEach(async (): Promise<void> => {
  vi.resetModules();
  serverModule = await import('../server');
  serverModule.server.listen({ onUnhandledRequest: 'error' });
});

afterEach((): void => {
  serverModule.server.close();
});

describe('POST /auth/login', () => {
  it('returns a token and the user for valid credentials', async (): Promise<void> => {
    const response = await fetch(`${BASE_URL}${authRoutes.login()}`, {
      method: 'POST',
      body: JSON.stringify({
        email: expectedUser.email,
        password: VALID_PASSWORD,
      }),
    });

    expect(response.status).toBe(200);
    const body = (await response.json()) as { token: string; user: unknown };
    expect(body.token).toBe(MOCK_TOKEN);
    expect(body.user).toBeTruthy();
  });

  it('rejects a missing email or password with 422', async (): Promise<void> => {
    const response = await fetch(`${BASE_URL}${authRoutes.login()}`, {
      method: 'POST',
      body: JSON.stringify({ email: expectedUser.email }),
    });

    expect(response.status).toBe(422);
  });

  it('rejects invalid credentials with 401', async (): Promise<void> => {
    const response = await fetch(`${BASE_URL}${authRoutes.login()}`, {
      method: 'POST',
      body: JSON.stringify({
        email: expectedUser.email,
        password: 'wrong-password',
      }),
    });

    expect(response.status).toBe(401);
  });
});

describe('POST /auth/register', () => {
  it('creates a new user for unused credentials', async (): Promise<void> => {
    const response = await fetch(`${BASE_URL}${authRoutes.register()}`, {
      method: 'POST',
      body: JSON.stringify({
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@priozen.app',
        password: 'password123',
      }),
    });

    expect(response.status).toBe(201);
    const body = (await response.json()) as {
      token: string;
      user: { email: string };
    };
    expect(body.user.email).toBe('ada@priozen.app');
  });

  it('rejects an incomplete payload with 422', async (): Promise<void> => {
    const response = await fetch(`${BASE_URL}${authRoutes.register()}`, {
      method: 'POST',
      body: JSON.stringify({ email: 'ada@priozen.app' }),
    });

    expect(response.status).toBe(422);
  });

  it('rejects an already-used email with 409', async (): Promise<void> => {
    const response = await fetch(`${BASE_URL}${authRoutes.register()}`, {
      method: 'POST',
      body: JSON.stringify({
        firstName: expectedUser.firstName,
        lastName: expectedUser.lastName,
        email: expectedUser.email,
        password: VALID_PASSWORD,
      }),
    });

    expect(response.status).toBe(409);
  });
});

describe('POST /auth/forgot-password', () => {
  it('always responds with 200 to avoid email enumeration', async (): Promise<void> => {
    const response = await fetch(`${BASE_URL}${authRoutes.forgotPassword()}`, {
      method: 'POST',
      body: JSON.stringify({ email: 'unknown@priozen.app' }),
    });

    expect(response.status).toBe(200);
  });
});

describe('POST /auth/reset-password', () => {
  it('rejects a missing token or password with 422', async (): Promise<void> => {
    const response = await fetch(`${BASE_URL}${authRoutes.resetPassword()}`, {
      method: 'POST',
      body: JSON.stringify({ password: 'new-password' }),
    });

    expect(response.status).toBe(422);
  });

  it('rejects an invalid token with 422', async (): Promise<void> => {
    const response = await fetch(`${BASE_URL}${authRoutes.resetPassword()}`, {
      method: 'POST',
      body: JSON.stringify({
        token: 'invalid-token',
        password: 'new-password',
      }),
    });

    expect(response.status).toBe(422);
  });

  it('accepts a valid token', async (): Promise<void> => {
    const response = await fetch(`${BASE_URL}${authRoutes.resetPassword()}`, {
      method: 'POST',
      body: JSON.stringify({ token: 'valid-token', password: 'new-password' }),
    });

    expect(response.status).toBe(200);
  });
});

describe('POST /auth/logout', () => {
  it('returns a success message', async (): Promise<void> => {
    const response = await fetch(`${BASE_URL}${authRoutes.logout()}`, {
      method: 'POST',
    });

    expect(response.status).toBe(200);
  });
});
