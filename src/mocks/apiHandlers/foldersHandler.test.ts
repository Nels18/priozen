import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { foldersRoutes } from '../../api/routes';
import { makeDumbFolder } from '../factories/folderFactory';

// Each test re-imports the mock server so the underlying database singleton
// starts from the seeded fixtures instead of leaking state across tests.
let serverModule: typeof import('../server');

const BASE_URL = 'http://test.local';

const expectedFolders = [
  makeDumbFolder({ taskCount: 4 }),
  makeDumbFolder({
    id: 'folder-2',
    name: 'Travail',
    color: '#F59E0B',
    taskCount: 6,
    createdAt: '2026-01-11T00:00:00.000Z',
  }),
  makeDumbFolder({
    id: 'folder-3',
    name: 'Priolist App',
    color: '#10B981',
    taskCount: 5,
    createdAt: '2026-01-12T00:00:00.000Z',
  }),
];

beforeEach(async (): Promise<void> => {
  vi.resetModules();
  serverModule = await import('../server');
  serverModule.server.listen({ onUnhandledRequest: 'error' });
});

afterEach((): void => {
  serverModule.server.close();
});

const [firstFolder] = expectedFolders;

describe('GET /folders', () => {
  it('returns the seeded folders', async (): Promise<void> => {
    const response = await fetch(`${BASE_URL}${foldersRoutes.list()}`);
    expect(response.status).toBe(200);
    const body = (await response.json()) as unknown[];
    expect(body).toHaveLength(expectedFolders.length);
  });
});

describe('GET /folders/:id', () => {
  it('returns the matching folder', async (): Promise<void> => {
    const response = await fetch(
      `${BASE_URL}${foldersRoutes.detail(firstFolder.id)}`,
    );
    expect(response.status).toBe(200);
    const body = (await response.json()) as { name: string };
    expect(body.name).toBe(firstFolder.name);
  });

  it('returns 404 for an unknown folder', async (): Promise<void> => {
    const response = await fetch(
      `${BASE_URL}${foldersRoutes.detail('missing')}`,
    );
    expect(response.status).toBe(404);
  });
});

describe('POST /folders', () => {
  it('creates a folder with default color and task count', async (): Promise<void> => {
    const response = await fetch(`${BASE_URL}${foldersRoutes.list()}`, {
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
    const response = await fetch(`${BASE_URL}${foldersRoutes.list()}`, {
      method: 'POST',
      body: JSON.stringify({}),
    });

    expect(response.status).toBe(422);
  });
});

describe('PATCH /folders/:id', () => {
  it('updates an existing folder', async (): Promise<void> => {
    const response = await fetch(
      `${BASE_URL}${foldersRoutes.detail(firstFolder.id)}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ name: 'Personnel' }),
      },
    );

    expect(response.status).toBe(200);
    const body = (await response.json()) as { name: string };
    expect(body.name).toBe('Personnel');
  });

  it('returns 404 for an unknown folder', async (): Promise<void> => {
    const response = await fetch(
      `${BASE_URL}${foldersRoutes.detail('missing')}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ name: 'x' }),
      },
    );

    expect(response.status).toBe(404);
  });
});

describe('DELETE /folders/:id', () => {
  it('deletes an existing folder', async (): Promise<void> => {
    const response = await fetch(
      `${BASE_URL}${foldersRoutes.detail(firstFolder.id)}`,
      { method: 'DELETE' },
    );

    expect(response.status).toBe(200);
  });

  it('returns 404 for an unknown folder', async (): Promise<void> => {
    const response = await fetch(
      `${BASE_URL}${foldersRoutes.detail('missing')}`,
      { method: 'DELETE' },
    );

    expect(response.status).toBe(404);
  });
});
