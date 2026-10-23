import { useEffect, useState } from 'react';
import { listTasks } from '../api/tasks';
import type { TaskSummary } from './summary';
import { summarizeTasks } from './summary';

export type TaskSummaryState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; summary: TaskSummary };

/**
 * Loads the tasks once and summarizes them for the right panel.
 * DASH-02 will share task state so the panel refreshes after each change.
 */
export const useTaskSummary = (): TaskSummaryState => {
  const [state, setState] = useState<TaskSummaryState>({ status: 'loading' });

  useEffect(() => {
    let isCancelled = false;
    listTasks()
      .then((tasks) => {
        if (!isCancelled) {
          setState({
            status: 'ready',
            summary: summarizeTasks(tasks, new Date()),
          });
        }
      })
      .catch(() => {
        if (!isCancelled) setState({ status: 'error' });
      });
    return (): void => {
      isCancelled = true;
    };
  }, []);

  return state;
};
