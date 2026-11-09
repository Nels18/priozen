import { MutationObserver } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestQueryClient } from '../test/queryClient';
import { TEST_API_URL } from '../test/constants';
import type { Task } from '../types/models';

// Re-import modules per test so the MSW database singleton starts fresh.
let serverModule: typeof import('../mocks/server');
let taskQueriesModule: typeof import('./taskQueries');
let taskMutationsModule: typeof import('./taskMutations');

beforeEach(async (): Promise<void> => {
  vi.resetModules();
  vi.stubEnv('EXPO_PUBLIC_API_URL', TEST_API_URL);
  serverModule = await import('../mocks/server');
  taskQueriesModule = await import('./taskQueries');
  taskMutationsModule = await import('./taskMutations');
  serverModule.server.listen({ onUnhandledRequest: 'error' });
});

afterEach((): void => {
  serverModule.server.close();
  vi.unstubAllEnvs();
});

const findTask = (tasks: Task[] | undefined, id: string): Task | undefined =>
  tasks?.find((task) => task.id === id);

describe('taskMutations.setDone', () => {
  it('updates the cached list before the server answers, then keeps it', async (): Promise<void> => {
    const queryClient = createTestQueryClient();
    const { taskQueries, taskKeys } = taskQueriesModule;
    const tasks = await queryClient.query(taskQueries.list());
    const target = tasks.find((task) => !task.isDone);
    if (!target) throw new Error('fixtures need an open task');

    const observer = new MutationObserver(
      queryClient,
      taskMutationsModule.taskMutations.setDone(queryClient),
    );
    const pending = observer.mutate({ id: target.id, isDone: true });

    // Optimistic: already done in the cache while the request is in flight.
    await vi.waitFor((): void => {
      expect(
        findTask(queryClient.getQueryData(taskKeys.list()), target.id)?.isDone,
      ).toBe(true);
    });

    const saved = await pending;
    expect(saved.isDone).toBe(true);
    // Resynced with the server afterwards: still done.
    await queryClient.refetchQueries({ queryKey: taskKeys.list() });
    expect(
      findTask(queryClient.getQueryData(taskKeys.list()), target.id)?.isDone,
    ).toBe(true);
  });

  it('restores the previous list when the request fails', async (): Promise<void> => {
    const queryClient = createTestQueryClient();
    const { taskQueries, taskKeys } = taskQueriesModule;
    const tasks = await queryClient.query(taskQueries.list());
    const target = tasks.find((task) => !task.isDone);
    if (!target) throw new Error('fixtures need an open task');

    serverModule.server.use(
      http.patch(`${TEST_API_URL}/tasks/:id`, () =>
        HttpResponse.json({ message: 'Server error.' }, { status: 500 }),
      ),
      // The resync after the failure must not hide a missing rollback.
      http.get(`${TEST_API_URL}/tasks`, () => HttpResponse.json(tasks)),
    );

    const observer = new MutationObserver(
      queryClient,
      taskMutationsModule.taskMutations.setDone(queryClient),
    );
    await expect(
      observer.mutate({ id: target.id, isDone: true }),
    ).rejects.toThrow('Server error.');

    expect(
      findTask(queryClient.getQueryData(taskKeys.list()), target.id)?.isDone,
    ).toBe(false);
  });
});

describe('taskMutations.create', () => {
  it('creates the task and resolves once the list shows it', async (): Promise<void> => {
    const queryClient = createTestQueryClient();
    const { taskQueries, taskKeys } = taskQueriesModule;
    await queryClient.query(taskQueries.list());

    const observer = new MutationObserver(
      queryClient,
      taskMutationsModule.taskMutations.create(queryClient),
    );
    const created = await observer.mutate({
      title: 'Appeler le fournisseur',
      description: null,
      quadrant: 'delegate',
      folderId: null,
      dueDate: null,
    });

    expect(created.quadrant).toBe('delegate');
    const listed = findTask(
      queryClient.getQueryData(taskKeys.list()),
      created.id,
    );
    expect(listed?.title).toBe('Appeler le fournisseur');
    expect(listed?.quadrant).toBe('delegate');
  });
});

describe('taskMutations.update', () => {
  it('saves the changes and resolves once the list shows them', async (): Promise<void> => {
    const queryClient = createTestQueryClient();
    const { taskQueries, taskKeys } = taskQueriesModule;
    const [target] = await queryClient.query(taskQueries.list());

    const observer = new MutationObserver(
      queryClient,
      taskMutationsModule.taskMutations.update(queryClient),
    );
    await observer.mutate({
      id: target.id,
      changes: { title: 'Titre modifié', quadrant: 'secondary' },
    });

    const listed = findTask(
      queryClient.getQueryData(taskKeys.list()),
      target.id,
    );
    expect(listed?.title).toBe('Titre modifié');
    expect(listed?.quadrant).toBe('secondary');
  });
});
