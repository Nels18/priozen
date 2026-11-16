import type { Task } from '../types/models';

export interface SubTaskProgress {
  done: number;
  total: number;
}

/**
 * Checked sub-tasks out of all of them: the "1/3" of a task row and the bar of
 * the task detail. `total` is 0 for a task without sub-tasks, which shows
 * neither. Independent of the task's own state: a done task can have
 * unchecked sub-tasks, and all sub-tasks checked doesn't make the task done.
 */
export const subtaskProgress = ({
  subTasks,
}: Pick<Task, 'subTasks'>): SubTaskProgress => ({
  done: subTasks.filter((subTask) => subTask.isDone).length,
  total: subTasks.length,
});
