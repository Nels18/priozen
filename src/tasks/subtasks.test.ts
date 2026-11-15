import { describe, expect, it } from 'vitest';
import type { SubTask } from '../types/models';
import { subtaskProgress } from './subtasks';

const subTask = (id: string, isDone: boolean): SubTask => ({
  id,
  taskId: 'task-1',
  title: `Sous-tâche ${id}`,
  isDone,
});

describe('subtaskProgress', () => {
  it('is 0/0 for a task without sub-tasks', (): void => {
    expect(subtaskProgress({ subTasks: [] })).toEqual({ done: 0, total: 0 });
  });

  it('counts the checked sub-tasks', (): void => {
    expect(
      subtaskProgress({
        subTasks: [
          subTask('a', true),
          subTask('b', false),
          subTask('c', false),
        ],
      }),
    ).toEqual({ done: 1, total: 3 });
  });

  it('is complete when every sub-task is checked', (): void => {
    expect(
      subtaskProgress({ subTasks: [subTask('a', true), subTask('b', true)] }),
    ).toEqual({ done: 2, total: 2 });
  });

  it('follows a replaced list, not the previous one', (): void => {
    const before = { subTasks: [subTask('a', true), subTask('b', false)] };
    const after = { ...before, subTasks: [subTask('c', false)] };

    expect(subtaskProgress(before)).toEqual({ done: 1, total: 2 });
    expect(subtaskProgress(after)).toEqual({ done: 0, total: 1 });
  });
});
