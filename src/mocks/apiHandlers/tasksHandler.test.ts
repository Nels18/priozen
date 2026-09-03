import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { tasksRoutes } from '../../api/routes';
import type { Task } from '../data/fixtures';
import { makeDumbTask } from '../factories/taskFactory';

// Each test re-imports the mock server so the underlying database singleton
// starts from the seeded fixtures instead of leaking state across tests.
let serverModule: typeof import('../server');

const BASE_URL = 'http://test.local';

const expectedTasks: Task[] = [
  makeDumbTask({
    quadrant: 'critical',
    folderId: 'folder-3',
    description: 'Intégrer le formulaire avec validation et appel API.',
  }),
  makeDumbTask({
    id: 'task-2',
    title: 'Préparer la réunion client',
    quadrant: 'critical',
    folderId: 'folder-2',
    createdAt: '2026-04-19T09:00:00.000Z',
    updatedAt: '2026-04-19T09:00:00.000Z',
  }),
  makeDumbTask({
    id: 'task-3',
    title: 'Mettre en place les tests unitaires',
    description: 'Couvrir les composants Auth avec Vitest.',
    folderId: 'folder-3',
    createdAt: '2026-04-18T08:00:00.000Z',
    updatedAt: '2026-04-18T08:00:00.000Z',
  }),
  makeDumbTask({
    id: 'task-4',
    title: 'Rédiger la documentation technique',
    folderId: 'folder-3',
    createdAt: '2026-04-17T08:00:00.000Z',
    updatedAt: '2026-04-17T08:00:00.000Z',
  }),
  makeDumbTask({
    id: 'task-5',
    title: 'Répondre aux emails en attente',
    quadrant: 'delegate',
    createdAt: '2026-04-22T07:00:00.000Z',
    updatedAt: '2026-04-22T07:00:00.000Z',
  }),
  makeDumbTask({
    id: 'task-6',
    title: 'Trier les favoris du navigateur',
    quadrant: 'secondary',
    folderId: 'folder-1',
    createdAt: '2026-04-15T12:00:00.000Z',
    updatedAt: '2026-04-15T12:00:00.000Z',
  }),
  makeDumbTask({
    id: 'task-7',
    title: 'Setup CI/CD GitHub Actions',
    description: 'Configuration des workflows CI et release.',
    quadrant: 'critical',
    folderId: 'folder-3',
    isDone: true,
    createdAt: '2026-04-10T10:00:00.000Z',
    updatedAt: '2026-04-24T18:00:00.000Z',
  }),
  makeDumbTask({
    id: 'task-8',
    title: 'Configurer ESLint et Prettier',
    folderId: 'folder-3',
    isDone: true,
    createdAt: '2026-04-05T10:00:00.000Z',
    updatedAt: '2026-04-08T10:00:00.000Z',
  }),
  makeDumbTask({
    id: 'task-9',
    title: 'Ancienne tâche supprimée',
    quadrant: 'secondary',
    deletedAt: '2026-04-20T10:00:00.000Z',
    createdAt: '2026-04-01T10:00:00.000Z',
    updatedAt: '2026-04-20T10:00:00.000Z',
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

const activeTasks = expectedTasks.filter((task) => task.deletedAt === null);
const trashedTasks = expectedTasks.filter((task) => task.deletedAt !== null);
const [firstTask] = expectedTasks;
const [trashedTask] = trashedTasks;
const searchTarget = expectedTasks.find((task) =>
  task.title.toLowerCase().includes('connexion'),
)!;

describe('GET /tasks', () => {
  it('excludes soft-deleted tasks by default', async (): Promise<void> => {
    const response = await fetch(`${BASE_URL}${tasksRoutes.list()}`);
    expect(response.status).toBe(200);
    const body = (await response.json()) as Task[];
    expect(body).toHaveLength(activeTasks.length);
    expect(body.some((task) => task.id === trashedTask.id)).toBe(false);
  });

  it('includes soft-deleted tasks when deleted=true', async (): Promise<void> => {
    const response = await fetch(
      `${BASE_URL}${tasksRoutes.list()}?deleted=true`,
    );
    const body = (await response.json()) as Task[];
    expect(body).toHaveLength(trashedTasks.length);
    expect(body[0].id).toBe(trashedTask.id);
  });

  it('filters by folder_id', async (): Promise<void> => {
    const response = await fetch(
      `${BASE_URL}${tasksRoutes.list()}?folder_id=folder-1`,
    );
    const body = (await response.json()) as Task[];
    expect(body.every((task) => task.folderId === 'folder-1')).toBe(true);
  });

  it('filters by a case-insensitive search term', async (): Promise<void> => {
    const response = await fetch(
      `${BASE_URL}${tasksRoutes.list()}?search=CONNEXION`,
    );
    const body = (await response.json()) as Task[];
    expect(body).toHaveLength(1);
    expect(body[0].id).toBe(searchTarget.id);
  });

  it('sorts by priority (critical > schedule > delegate > secondary) by default', async (): Promise<void> => {
    const response = await fetch(`${BASE_URL}${tasksRoutes.list()}`);
    const body = (await response.json()) as Task[];
    const order: Record<string, number> = {
      critical: 0,
      schedule: 1,
      delegate: 2,
      secondary: 3,
    };
    const quadrantRanks = body.map((task) => order[task.quadrant]);
    const sortedRanks = [...quadrantRanks].sort((a, b) => a - b);
    expect(quadrantRanks).toEqual(sortedRanks);
  });

  it('sorts by name when sort=name', async (): Promise<void> => {
    const response = await fetch(`${BASE_URL}${tasksRoutes.list()}?sort=name`);
    const body = (await response.json()) as Task[];
    const titles = body.map((task) => task.title);
    const sortedTitles = [...titles].sort((a, b) => a.localeCompare(b));
    expect(titles).toEqual(sortedTitles);
  });
});

describe('GET /tasks/:id', () => {
  it('returns the matching task', async (): Promise<void> => {
    const response = await fetch(
      `${BASE_URL}${tasksRoutes.detail(firstTask.id)}`,
    );
    expect(response.status).toBe(200);
    const body = (await response.json()) as Task;
    expect(body.title).toBe(firstTask.title);
  });

  it('returns 404 for an unknown task', async (): Promise<void> => {
    const response = await fetch(`${BASE_URL}${tasksRoutes.detail('missing')}`);
    expect(response.status).toBe(404);
  });
});

describe('POST /tasks', () => {
  it('creates a task with sensible defaults', async (): Promise<void> => {
    const response = await fetch(`${BASE_URL}${tasksRoutes.list()}`, {
      method: 'POST',
      body: JSON.stringify({ title: 'Nouvelle tâche' }),
    });

    expect(response.status).toBe(201);
    const body = (await response.json()) as Task;
    expect(body.title).toBe('Nouvelle tâche');
    expect(body.quadrant).toBe('schedule');
    expect(body.isDone).toBe(false);
    expect(body.deletedAt).toBeNull();
  });

  it('rejects a missing or blank title with 422', async (): Promise<void> => {
    const response = await fetch(`${BASE_URL}${tasksRoutes.list()}`, {
      method: 'POST',
      body: JSON.stringify({ title: '   ' }),
    });

    expect(response.status).toBe(422);
  });
});

describe('PATCH /tasks/:id', () => {
  it('updates an existing task', async (): Promise<void> => {
    const response = await fetch(
      `${BASE_URL}${tasksRoutes.detail(firstTask.id)}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ isDone: true }),
      },
    );

    expect(response.status).toBe(200);
    const body = (await response.json()) as Task;
    expect(body.isDone).toBe(true);
  });

  it('returns 404 for an unknown task', async (): Promise<void> => {
    const response = await fetch(
      `${BASE_URL}${tasksRoutes.detail('missing')}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ isDone: true }),
      },
    );

    expect(response.status).toBe(404);
  });
});

describe('DELETE /tasks/:id', () => {
  it('soft-deletes a task by setting deletedAt', async (): Promise<void> => {
    const response = await fetch(
      `${BASE_URL}${tasksRoutes.detail(firstTask.id)}`,
      { method: 'DELETE' },
    );

    expect(response.status).toBe(200);

    const taskResponse = await fetch(
      `${BASE_URL}${tasksRoutes.detail(firstTask.id)}`,
    );
    const body = (await taskResponse.json()) as Task;
    expect(body.deletedAt).not.toBeNull();
  });

  it('returns 404 for an unknown task', async (): Promise<void> => {
    const response = await fetch(
      `${BASE_URL}${tasksRoutes.detail('missing')}`,
      { method: 'DELETE' },
    );

    expect(response.status).toBe(404);
  });
});

describe('POST /tasks/:id/restore', () => {
  it('clears deletedAt on the trashed task', async (): Promise<void> => {
    const response = await fetch(
      `${BASE_URL}${tasksRoutes.restore(trashedTask.id)}`,
      { method: 'POST' },
    );

    expect(response.status).toBe(200);
    const body = (await response.json()) as Task;
    expect(body.deletedAt).toBeNull();
  });

  it('returns 404 for an unknown task', async (): Promise<void> => {
    const response = await fetch(
      `${BASE_URL}${tasksRoutes.restore('missing')}`,
      { method: 'POST' },
    );

    expect(response.status).toBe(404);
  });
});

describe('DELETE /tasks/:id/permanent', () => {
  it('removes the task entirely', async (): Promise<void> => {
    const response = await fetch(
      `${BASE_URL}${tasksRoutes.permanent(trashedTask.id)}`,
      { method: 'DELETE' },
    );

    expect(response.status).toBe(200);

    const getResponse = await fetch(
      `${BASE_URL}${tasksRoutes.detail(trashedTask.id)}`,
    );
    expect(getResponse.status).toBe(404);
  });

  it('returns 404 for an unknown task', async (): Promise<void> => {
    const response = await fetch(
      `${BASE_URL}${tasksRoutes.permanent('missing')}`,
      { method: 'DELETE' },
    );

    expect(response.status).toBe(404);
  });
});

describe('DELETE /tasks/trash/empty', () => {
  it('drops every soft-deleted task', async (): Promise<void> => {
    const response = await fetch(`${BASE_URL}${tasksRoutes.trashEmpty()}`, {
      method: 'DELETE',
    });

    expect(response.status).toBe(200);

    const listResponse = await fetch(
      `${BASE_URL}${tasksRoutes.list()}?deleted=true`,
    );
    const body = (await listResponse.json()) as Task[];
    expect(body).toHaveLength(0);
  });
});
