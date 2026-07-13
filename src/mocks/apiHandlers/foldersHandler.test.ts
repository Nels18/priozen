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

describe('GET /folders', () => {
  it('returns the seeded folders', async (): Promise<void> => {
    const response = await fetch('http://test.local/folders');
    expect(response.status).toBe(200);
    const body = (await response.json()) as unknown[];
    expect(body).toHaveLength(3);
  });
});

describe('GET /folders/:id', () => {
  it('returns the matching folder', async (): Promise<void> => {
    const response = await fetch('http://test.local/folders/folder-1');
    expect(response.status).toBe(200);
    const body = (await response.json()) as { name: string };
    expect(body.name).toBe('Perso');
  });

  it('returns 404 for an unknown folder', async (): Promise<void> => {
    const response = await fetch('http://test.local/folders/missing');
    expect(response.status).toBe(404);
  });
});

describe('POST /folders', () => {
  it('creates a folder with default color and task count', async (): Promise<void> => {
    const response = await fetch('http://test.local/folders', {
      method: 'POST',
      body: JSON.stringify({ name: 'Loisirs' }),
    });

    expect(response.status).toBe(201);
    const body = (await response.json()) as {
      name: string;
      color: string;
      taskCount: number;
    };
    expect(body.name).toBe('Loisirs');
    expect(body.color).toBe('#6366F1');
    expect(body.taskCount).toBe(0);
  });

  it('rejects a missing name with 422', async (): Promise<void> => {
    const response = await fetch('http://test.local/folders', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    expect(response.status).toBe(422);
  });
});

describe('PATCH /folders/:id', () => {
  it('updates an existing folder', async (): Promise<void> => {
    const response = await fetch('http://test.local/folders/folder-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'Personnel' }),
    });

    expect(response.status).toBe(200);
    const body = (await response.json()) as { name: string };
    expect(body.name).toBe('Personnel');
  });

  it('returns 404 for an unknown folder', async (): Promise<void> => {
    const response = await fetch('http://test.local/folders/missing', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'x' }),
    });

    expect(response.status).toBe(404);
  });
});

describe('DELETE /folders/:id', () => {
  it('deletes an existing folder', async (): Promise<void> => {
    const response = await fetch('http://test.local/folders/folder-1', {
      method: 'DELETE',
    });

    expect(response.status).toBe(200);
  });

  it('returns 404 for an unknown folder', async (): Promise<void> => {
    const response = await fetch('http://test.local/folders/missing', {
      method: 'DELETE',
    });

    expect(response.status).toBe(404);
  });
});
