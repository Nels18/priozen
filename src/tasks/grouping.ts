import type { EisenhowerQuadrant, Task } from '../types/models';
import { EISENHOWER_QUADRANTS } from './quadrants';

export interface GroupedTasks {
  /** Open tasks per quadrant, in the order received (API sort). */
  open: Record<EisenhowerQuadrant, Task[]>;
  /** Done tasks, all quadrants together. */
  done: Task[];
}

/**
 * Splits the task list into the dashboard groups: one per quadrant for open
 * tasks, plus a "done" group. Ignores soft-deleted tasks.
 */
export const groupTasks = (tasks: Task[]): GroupedTasks => {
  const open = Object.fromEntries(
    EISENHOWER_QUADRANTS.map((quadrant) => [quadrant, [] as Task[]]),
  ) as Record<EisenhowerQuadrant, Task[]>;
  const done: Task[] = [];

  for (const task of tasks) {
    if (task.deletedAt !== null) continue;
    if (task.isDone) done.push(task);
    else open[task.quadrant].push(task);
  }

  return { open, done };
};
