import type { QueryClient } from '@tanstack/react-query';
import { mutationOptions } from '@tanstack/react-query';
import type { TaskInput, TaskUpdate } from '../api/tasks';
import { createTask, updateTask } from '../api/tasks';
import { folderKeys } from '../folders/folderQueries';
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

export interface UpdateTaskVariables {
  id: string;
  changes: TaskUpdate;
}

const SET_DONE_KEY = [...taskKeys.all, 'setDone'] as const;

/**
 * After a save: the saved task goes straight into the cached list (added or
 * replaced), so every screen shows it at once, displayed or not. Then the
 * tasks are resynced, and the folders too (their task count changes).
 */
const refreshAfterSave = (
  queryClient: QueryClient,
  saved: Task,
): Promise<unknown> => {
  queryClient.setQueryData<Task[]>(taskKeys.list(), (tasks) => {
    if (!tasks) return tasks;
    const isKnown = tasks.some((task) => task.id === saved.id);
    return isKnown
      ? tasks.map((task) => (task.id === saved.id ? saved : task))
      : [...tasks, saved];
  });
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: taskKeys.all }),
    queryClient.invalidateQueries({ queryKey: folderKeys.all }),
  ]);
};

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

  /**
   * Creates a task (task modal). Resolves once the task is in the cached list,
   * so the modal closes on a list that already shows the new task.
   */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
  create: (queryClient: QueryClient) =>
    mutationOptions<Task, Error, TaskInput>({
      mutationFn: createTask,
      onSuccess: (saved) => refreshAfterSave(queryClient, saved),
    }),

  /** Saves the task modal in edit mode; same refresh as `create`. */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
  update: (queryClient: QueryClient) =>
    mutationOptions<Task, Error, UpdateTaskVariables>({
      mutationFn: ({ id, changes }) => updateTask(id, changes),
      onSuccess: (saved) => refreshAfterSave(queryClient, saved),
    }),
};
