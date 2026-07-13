import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Each test re-imports the mock server so the underlying database singleton
// starts from the seeded fixtures instead of leaking state across tests.
let serverModule: typeof import('../server');

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
    const response = await fetch('http://test.local/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'nelson@priolist.app',
        password: 'password123',
      }),
    });

    expect(response.status).toBe(200);
    const body = (await response.json()) as { token: string; user: unknown };
    expect(body.token).toBe('mock-jwt-token-priolist-dev');
    expect(body.user).toBeTruthy();
  });

  it('rejects a missing email or password with 400', async (): Promise<void> => {
    const response = await fetch('http://test.local/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'nelson@priolist.app' }),
    });

    expect(response.status).toBe(400);
  });

  it('rejects invalid credentials with 401', async (): Promise<void> => {
    const response = await fetch('http://test.local/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'nelson@priolist.app',
        password: 'wrong-password',
      }),
    });

    expect(response.status).toBe(401);
  });
});

describe('POST /auth/register', () => {
  it('creates a new user for unused credentials', async (): Promise<void> => {
    const response = await fetch('http://test.local/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@priolist.app',
        password: 'password123',
      }),
    });

    expect(response.status).toBe(201);
    const body = (await response.json()) as {
      token: string;
      user: { email: string };
    };
    expect(body.user.email).toBe('ada@priolist.app');
  });

  it('rejects an incomplete payload with 400', async (): Promise<void> => {
    const response = await fetch('http://test.local/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: 'ada@priolist.app' }),
    });

    expect(response.status).toBe(400);
  });

  it('rejects an already-used email with 409', async (): Promise<void> => {
    const response = await fetch('http://test.local/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        firstName: 'Nelson',
        lastName: 'Belgarde',
        email: 'nelson@priolist.app',
        password: 'password123',
      }),
    });

    expect(response.status).toBe(409);
  });
});

describe('POST /auth/forgot-password', () => {
  it('always responds with 200 to avoid email enumeration', async (): Promise<void> => {
    const response = await fetch('http://test.local/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: 'unknown@priolist.app' }),
    });

    expect(response.status).toBe(200);
  });
});

describe('POST /auth/reset-password', () => {
  it('rejects a missing token or password with 400', async (): Promise<void> => {
    const response = await fetch('http://test.local/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ password: 'new-password' }),
    });

    expect(response.status).toBe(400);
  });

  it('rejects an invalid token with 400', async (): Promise<void> => {
    const response = await fetch('http://test.local/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        token: 'invalid-token',
        password: 'new-password',
      }),
    });

    expect(response.status).toBe(400);
  });

  it('accepts a valid token', async (): Promise<void> => {
    const response = await fetch('http://test.local/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token: 'valid-token', password: 'new-password' }),
    });

    expect(response.status).toBe(200);
  });
});

describe('POST /auth/logout', () => {
  it('returns a success message', async (): Promise<void> => {
    const response = await fetch('http://test.local/auth/logout', {
      method: 'POST',
    });

    expect(response.status).toBe(200);
  });
});
