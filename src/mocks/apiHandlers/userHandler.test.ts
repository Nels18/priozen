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

describe('GET /user/me', () => {
  it('returns the current user', async (): Promise<void> => {
    const response = await fetch('http://test.local/user/me');
    expect(response.status).toBe(200);
    const body = (await response.json()) as { email: string };
    expect(body.email).toBe('nelson@priolist.app');
  });
});

describe('PATCH /user/me', () => {
  it('merges the given fields into the current user', async (): Promise<void> => {
    const response = await fetch('http://test.local/user/me', {
      method: 'PATCH',
      body: JSON.stringify({ firstName: 'Alice' }),
    });

    expect(response.status).toBe(200);
    const body = (await response.json()) as { firstName: string };
    expect(body.firstName).toBe('Alice');
  });
});

describe('PATCH /user/me/password', () => {
  it('rejects a missing password with 400', async (): Promise<void> => {
    const response = await fetch('http://test.local/user/me/password', {
      method: 'PATCH',
      body: JSON.stringify({ currentPassword: 'password123' }),
    });

    expect(response.status).toBe(400);
  });

  it('rejects an incorrect current password with 401', async (): Promise<void> => {
    const response = await fetch('http://test.local/user/me/password', {
      method: 'PATCH',
      body: JSON.stringify({
        currentPassword: 'wrong-password',
        newPassword: 'new-password',
      }),
    });

    expect(response.status).toBe(401);
  });

  it('accepts a correct current password', async (): Promise<void> => {
    const response = await fetch('http://test.local/user/me/password', {
      method: 'PATCH',
      body: JSON.stringify({
        currentPassword: 'password123',
        newPassword: 'new-password',
      }),
    });

    expect(response.status).toBe(200);
  });
});

describe('DELETE /user/me', () => {
  it('returns a success message', async (): Promise<void> => {
    const response = await fetch('http://test.local/user/me', {
      method: 'DELETE',
    });

    expect(response.status).toBe(200);
  });
});
