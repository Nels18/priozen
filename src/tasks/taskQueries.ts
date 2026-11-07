import { queryOptions } from '@tanstack/react-query';
import { listTasks } from '../api/tasks';

/**
 * Query keys and options for tasks. Every screen reads tasks through these
 * factories, so they share one cache entry and one invalidation key
 * (`taskKeys.all`) for mutations.
 */
export const taskKeys = {
  all: ['tasks'] as const,
  list: () => [...taskKeys.all, 'list'] as const,
};

export const taskQueries = {
  /** Active (non-deleted) tasks, sorted by Eisenhower priority. */
  // Return type left inferred on purpose: it carries the key ↔ data typing.
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
  list: () =>
    queryOptions({
      queryKey: taskKeys.list(),
      queryFn: listTasks,
    }),
};
