import type { EisenhowerQuadrant, Task } from '../types/models';
import { EISENHOWER_QUADRANTS } from './quadrants';

export interface TaskSummary {
  /** Open (not done) tasks per quadrant. */
  openByQuadrant: Record<EisenhowerQuadrant, number>;
  doneCount: number;
  totalCount: number;
  /** Open tasks whose due date is before today, oldest first. */
  overdue: Task[];
}

const startOfDay = (date: Date): number =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

/** Figures shown in the right panel; ignores soft-deleted tasks. */
export const summarizeTasks = (tasks: Task[], now: Date): TaskSummary => {
  const active = tasks.filter((task) => task.deletedAt === null);
  const today = startOfDay(now);

  const openByQuadrant = Object.fromEntries(
    EISENHOWER_QUADRANTS.map((quadrant) => [quadrant, 0]),
  ) as Record<EisenhowerQuadrant, number>;
  for (const task of active) {
    if (!task.isDone) openByQuadrant[task.quadrant] += 1;
  }

  const overdue = active
    .filter(
      (task) =>
        !task.isDone &&
        task.dueDate !== null &&
        startOfDay(new Date(task.dueDate)) < today,
    )
    .sort((a, b) => (a.dueDate ?? '').localeCompare(b.dueDate ?? ''));

  return {
    openByQuadrant,
    doneCount: active.filter((task) => task.isDone).length,
    totalCount: active.length,
    overdue,
  };
};
