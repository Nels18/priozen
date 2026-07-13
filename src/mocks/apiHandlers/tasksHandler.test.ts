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

interface TaskDto {
  id: string;
  title: string;
  quadrant: string;
  folderId: string | null;
  dueDate: string | null;
  isDone: boolean;
  deletedAt: string | null;
}

describe('GET /tasks', () => {
  it('excludes soft-deleted tasks by default', async (): Promise<void> => {
    const response = await fetch('http://test.local/tasks');
    expect(response.status).toBe(200);
    const body = (await response.json()) as TaskDto[];
    expect(body).toHaveLength(8);
    expect(body.some((task) => task.id === 'task-9')).toBe(false);
  });

  it('includes soft-deleted tasks when deleted=true', async (): Promise<void> => {
    const response = await fetch('http://test.local/tasks?deleted=true');
    const body = (await response.json()) as TaskDto[];
    expect(body).toHaveLength(1);
    expect(body[0].id).toBe('task-9');
  });

  it('filters by folder_id', async (): Promise<void> => {
    const response = await fetch('http://test.local/tasks?folder_id=folder-1');
    const body = (await response.json()) as TaskDto[];
    expect(body.every((task) => task.folderId === 'folder-1')).toBe(true);
  });

  it('filters by a case-insensitive search term', async (): Promise<void> => {
    const response = await fetch('http://test.local/tasks?search=CONNEXION');
    const body = (await response.json()) as TaskDto[];
    expect(body).toHaveLength(1);
    expect(body[0].id).toBe('task-1');
  });

  it('sorts by priority (critical > schedule > delegate > secondary) by default', async (): Promise<void> => {
    const response = await fetch('http://test.local/tasks');
    const body = (await response.json()) as TaskDto[];
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
    const response = await fetch('http://test.local/tasks?sort=name');
    const body = (await response.json()) as TaskDto[];
    const titles = body.map((task) => task.title);
    const sortedTitles = [...titles].sort((a, b) => a.localeCompare(b));
    expect(titles).toEqual(sortedTitles);
  });
});

describe('GET /tasks/:id', () => {
  it('returns the matching task', async (): Promise<void> => {
    const response = await fetch('http://test.local/tasks/task-1');
    expect(response.status).toBe(200);
    const body = (await response.json()) as TaskDto;
    expect(body.title).toBe('Finaliser la page de connexion');
  });

  it('returns 404 for an unknown task', async (): Promise<void> => {
    const response = await fetch('http://test.local/tasks/missing');
    expect(response.status).toBe(404);
  });
});

describe('POST /tasks', () => {
  it('creates a task with sensible defaults', async (): Promise<void> => {
    const response = await fetch('http://test.local/tasks', {
      method: 'POST',
      body: JSON.stringify({ title: 'Nouvelle tâche' }),
    });

    expect(response.status).toBe(201);
    const body = (await response.json()) as TaskDto;
    expect(body.title).toBe('Nouvelle tâche');
    expect(body.quadrant).toBe('schedule');
    expect(body.isDone).toBe(false);
    expect(body.deletedAt).toBeNull();
  });

  it('rejects a missing or blank title with 400', async (): Promise<void> => {
    const response = await fetch('http://test.local/tasks', {
      method: 'POST',
      body: JSON.stringify({ title: '   ' }),
    });

    expect(response.status).toBe(400);
  });
});

describe('PATCH /tasks/:id', () => {
  it('updates an existing task', async (): Promise<void> => {
    const response = await fetch('http://test.local/tasks/task-1', {
      method: 'PATCH',
      body: JSON.stringify({ isDone: true }),
    });

    expect(response.status).toBe(200);
    const body = (await response.json()) as TaskDto;
    expect(body.isDone).toBe(true);
  });

  it('returns 404 for an unknown task', async (): Promise<void> => {
    const response = await fetch('http://test.local/tasks/missing', {
      method: 'PATCH',
      body: JSON.stringify({ isDone: true }),
    });

    expect(response.status).toBe(404);
  });
});

describe('DELETE /tasks/:id', () => {
  it('soft-deletes a task by setting deletedAt', async (): Promise<void> => {
    const response = await fetch('http://test.local/tasks/task-1', {
      method: 'DELETE',
    });

    expect(response.status).toBe(200);

    const taskResponse = await fetch('http://test.local/tasks/task-1');
    const body = (await taskResponse.json()) as TaskDto;
    expect(body.deletedAt).not.toBeNull();
  });

  it('returns 404 for an unknown task', async (): Promise<void> => {
    const response = await fetch('http://test.local/tasks/missing', {
      method: 'DELETE',
    });

    expect(response.status).toBe(404);
  });
});

describe('POST /tasks/:id/restore', () => {
  it('clears deletedAt on the trashed task', async (): Promise<void> => {
    const response = await fetch('http://test.local/tasks/task-9/restore', {
      method: 'POST',
    });

    expect(response.status).toBe(200);
    const body = (await response.json()) as TaskDto;
    expect(body.deletedAt).toBeNull();
  });

  it('returns 404 for an unknown task', async (): Promise<void> => {
    const response = await fetch('http://test.local/tasks/missing/restore', {
      method: 'POST',
    });

    expect(response.status).toBe(404);
  });
});

describe('DELETE /tasks/:id/permanent', () => {
  it('removes the task entirely', async (): Promise<void> => {
    const response = await fetch('http://test.local/tasks/task-9/permanent', {
      method: 'DELETE',
    });

    expect(response.status).toBe(200);

    const getResponse = await fetch('http://test.local/tasks/task-9');
    expect(getResponse.status).toBe(404);
  });

  it('returns 404 for an unknown task', async (): Promise<void> => {
    const response = await fetch('http://test.local/tasks/missing/permanent', {
      method: 'DELETE',
    });

    expect(response.status).toBe(404);
  });
});

describe('DELETE /tasks/trash/empty', () => {
  it('drops every soft-deleted task', async (): Promise<void> => {
    const response = await fetch('http://test.local/tasks/trash/empty', {
      method: 'DELETE',
    });

    expect(response.status).toBe(200);

    const listResponse = await fetch('http://test.local/tasks?deleted=true');
    const body = (await listResponse.json()) as TaskDto[];
    expect(body).toHaveLength(0);
  });
});
