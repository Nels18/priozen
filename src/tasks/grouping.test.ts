import { describe, expect, it } from 'vitest';
import type { Task } from '../types/models';
import { groupTasks } from './grouping';

const makeTask = (overrides: Partial<Task>): Task => ({
  id: 'task',
  title: 'Task',
  description: null,
  quadrant: 'critical',
  folderId: null,
  userId: 'user-1',
  dueDate: null,
  isDone: false,
  deletedAt: null,
  createdAt: '2026-10-01T00:00:00.000Z',
  updatedAt: '2026-10-01T00:00:00.000Z',
  ...overrides,
});

describe('groupTasks', () => {
  it('puts open tasks in their quadrant and done tasks apart', (): void => {
    const grouped = groupTasks([
      makeTask({ id: 'a', quadrant: 'critical' }),
      makeTask({ id: 'b', quadrant: 'delegate' }),
      makeTask({ id: 'c', quadrant: 'critical', isDone: true }),
      makeTask({ id: 'd', quadrant: 'critical' }),
    ]);

    expect(grouped.open.critical.map((task) => task.id)).toEqual(['a', 'd']);
    expect(grouped.open.delegate.map((task) => task.id)).toEqual(['b']);
    expect(grouped.open.schedule).toEqual([]);
    expect(grouped.open.secondary).toEqual([]);
    expect(grouped.done.map((task) => task.id)).toEqual(['c']);
  });

  it('ignores soft-deleted tasks', (): void => {
    const grouped = groupTasks([
      makeTask({ id: 'a', deletedAt: '2026-10-10T00:00:00.000Z' }),
      makeTask({
        id: 'b',
        isDone: true,
        deletedAt: '2026-10-10T00:00:00.000Z',
      }),
    ]);

    expect(grouped.open.critical).toEqual([]);
    expect(grouped.done).toEqual([]);
  });
});
