import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import type { Task } from '../types/models';
import { useStartOfToday } from '../utils/startOfToday';
import type { TaskSummary } from './summary';
import { summarizeTasks } from './summary';
import { taskQueries } from './taskQueries';

/**
 * Right-panel figures, derived from the shared task list: any screen that
 * updates or invalidates the tasks refreshes the panel too. The summary is
 * also recomputed at midnight, so "overdue" stays right even when the tasks
 * themselves don't change.
 */
export const useTaskSummary = (): UseQueryResult<TaskSummary> => {
  const startOfToday = useStartOfToday();
  const selectSummary = useCallback(
    (tasks: Task[]): TaskSummary =>
      summarizeTasks(tasks, new Date(startOfToday)),
    [startOfToday],
  );

  return useQuery({ ...taskQueries.list(), select: selectSummary });
};
