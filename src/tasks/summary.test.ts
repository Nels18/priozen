import { describe, expect, it } from 'vitest';
import type { Task } from '../types/models';
import { summarizeTasks } from './summary';

const NOW = new Date(2026, 9, 18, 15, 0); // 18 Oct 2026, 15:00 local time

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

describe('summarizeTasks', () => {
  it('counts open tasks per quadrant and overall progress', (): void => {
    const summary = summarizeTasks(
      [
        makeTask({ id: 'a', quadrant: 'critical' }),
        makeTask({ id: 'b', quadrant: 'critical' }),
        makeTask({ id: 'c', quadrant: 'schedule', isDone: true }),
        makeTask({ id: 'd', quadrant: 'delegate' }),
      ],
      NOW,
    );

    expect(summary.openByQuadrant).toEqual({
      critical: 2,
      schedule: 0,
      delegate: 1,
      secondary: 0,
    });
    expect(summary.doneCount).toBe(1);
    expect(summary.totalCount).toBe(4);
  });

  it('lists open tasks due before today as overdue, oldest first', (): void => {
    const summary = summarizeTasks(
      [
        makeTask({
          id: 'yesterday',
          dueDate: new Date(2026, 9, 17).toISOString(),
        }),
        makeTask({
          id: 'lastWeek',
          dueDate: new Date(2026, 9, 11).toISOString(),
        }),
        makeTask({ id: 'today', dueDate: new Date(2026, 9, 18).toISOString() }),
        makeTask({
          id: 'doneLate',
          dueDate: new Date(2026, 9, 1).toISOString(),
          isDone: true,
        }),
        makeTask({ id: 'noDate' }),
      ],
      NOW,
    );

    expect(summary.overdue.map((task) => task.id)).toEqual([
      'lastWeek',
      'yesterday',
    ]);
  });

  it('ignores soft-deleted tasks', (): void => {
    const summary = summarizeTasks(
      [makeTask({ deletedAt: '2026-10-10T00:00:00.000Z' })],
      NOW,
    );

    expect(summary.totalCount).toBe(0);
    expect(summary.openByQuadrant.critical).toBe(0);
  });
});
