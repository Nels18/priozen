import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockTasks } from '../mocks/data/fixtures';
import { createTestQueryClient } from '../test/queryClient';
import { TEST_API_URL } from '../test/constants';

// Re-import modules per test so the MSW database singleton starts fresh.
let serverModule: typeof import('../mocks/server');
let taskQueriesModule: typeof import('./taskQueries');

beforeEach(async (): Promise<void> => {
  vi.resetModules();
  vi.stubEnv('EXPO_PUBLIC_API_URL', TEST_API_URL);
  serverModule = await import('../mocks/server');
  taskQueriesModule = await import('./taskQueries');
  serverModule.server.listen({ onUnhandledRequest: 'error' });
});

afterEach((): void => {
  serverModule.server.close();
  vi.unstubAllEnvs();
});

describe('taskQueries.list', () => {
  it('loads the active tasks from the API into the cache', async (): Promise<void> => {
    const queryClient = createTestQueryClient();
    const { taskQueries, taskKeys } = taskQueriesModule;

    const tasks = await queryClient.query(taskQueries.list());

    const activeCount = mockTasks.filter((t) => t.deletedAt === null).length;
    expect(tasks).toHaveLength(activeCount);
    expect(queryClient.getQueryData(taskKeys.list())).toBe(tasks);
  });

  it('is invalidated through the shared tasks key', async (): Promise<void> => {
    const queryClient = createTestQueryClient();
    const { taskQueries, taskKeys } = taskQueriesModule;
    await queryClient.query(taskQueries.list());

    await queryClient.invalidateQueries({ queryKey: taskKeys.all });

    expect(queryClient.getQueryState(taskKeys.list())?.isInvalidated).toBe(
      true,
    );
  });
});
