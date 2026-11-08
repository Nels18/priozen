import type { QueryClient } from '@tanstack/react-query';
import { mutationOptions } from '@tanstack/react-query';
import { updateTask } from '../api/tasks';
import type { Task } from '../types/models';
import { taskKeys } from './taskQueries';

export interface SetTaskDoneVariables {
  id: string;
  isDone: boolean;
}

interface SetTaskDoneContext {
  /** Task list before the optimistic change, restored on failure. */
  previousTasks: Task[] | undefined;
}

const SET_DONE_KEY = [...taskKeys.all, 'setDone'] as const;

export const taskMutations = {
  /**
   * Checks or unchecks a task. The cached list changes at once (the task
   * moves between its quadrant and "done" without waiting for the server),
   * is rolled back if the request fails, then resynced with the server.
   */
  // Return type left inferred on purpose: it carries the variables ↔ context typing.
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
  setDone: (queryClient: QueryClient) =>
    mutationOptions<Task, Error, SetTaskDoneVariables, SetTaskDoneContext>({
      mutationKey: SET_DONE_KEY,
      mutationFn: ({ id, isDone }) => updateTask(id, { isDone }),
      onMutate: async ({ id, isDone }) => {
        // A refetch landing now would overwrite the optimistic change.
        await queryClient.cancelQueries({ queryKey: taskKeys.list() });
        const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.list());
        queryClient.setQueryData<Task[]>(taskKeys.list(), (tasks) =>
          tasks?.map((task) => (task.id === id ? { ...task, isDone } : task)),
        );
        return { previousTasks };
      },
      onError: (_error, _variables, context) => {
        if (context?.previousTasks) {
          queryClient.setQueryData(taskKeys.list(), context.previousTasks);
        }
      },
      onSettled: () => {
        // With several boxes ticked in a row, resync once, after the last
        // one: an earlier refetch would briefly undo the later ticks.
        if (queryClient.isMutating({ mutationKey: SET_DONE_KEY }) === 1) {
          return queryClient.invalidateQueries({ queryKey: taskKeys.all });
        }
        return undefined;
      },
    }),
};
