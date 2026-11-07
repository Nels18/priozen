import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { Task } from '../types/models';
import type { TaskSummary } from './summary';
import { summarizeTasks } from './summary';
import { taskQueries } from './taskQueries';

const selectSummary = (tasks: Task[]): TaskSummary =>
  summarizeTasks(tasks, new Date());

/**
 * Right-panel figures, derived from the shared task list: any screen that
 * updates or invalidates the tasks refreshes the panel too.
 */
export const useTaskSummary = (): UseQueryResult<TaskSummary> =>
  useQuery({ ...taskQueries.list(), select: selectSummary });
