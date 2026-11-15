import type { SubTask, Task } from '../types/models';
import { apiRequest } from './client';
import { tasksRoutes } from './routes';

/**
 * A sub-task as sent by the task modal. Without `id` it is created, with an
 * `id` it is kept (and renamed or re-checked); a sub-task left out of the
 * list is deleted. The order of the list is the order of the sub-tasks.
 */
export type SubTaskInput = Pick<SubTask, 'title' | 'isDone'> & {
  id?: string;
};

/** The whole checklist, replaced in one request. */
interface SubTasksField {
  subTasks?: SubTaskInput[];
}

/** Fields a client may change on a task (`PATCH /tasks/:id`). */
export type TaskUpdate = Partial<
  Pick<
    Task,
    'title' | 'description' | 'quadrant' | 'folderId' | 'dueDate' | 'isDone'
  >
> &
  SubTasksField;

/** Fields sent to create a task (`POST /tasks`); the server sets the rest. */
export type TaskInput = Pick<
  Task,
  'title' | 'description' | 'quadrant' | 'folderId' | 'dueDate'
> &
  SubTasksField;

/** Active (non-deleted) tasks, sorted by Eisenhower priority. */
export const listTasks = (): Promise<Task[]> =>
  apiRequest<Task[]>(tasksRoutes.list());

/** Resolves with the created task, as saved by the server. */
export const createTask = (input: TaskInput): Promise<Task> =>
  apiRequest<Task>(tasksRoutes.list(), {
    method: 'POST',
    body: JSON.stringify(input),
  });

/** Partial update; resolves with the task as saved by the server. */
export const updateTask = (id: string, changes: TaskUpdate): Promise<Task> =>
  apiRequest<Task>(tasksRoutes.detail(id), {
    method: 'PATCH',
    body: JSON.stringify(changes),
  });

/**
 * Checks or unchecks one sub-task (task detail). Resolves with the whole task,
 * so its progress is up to date. The task itself is not checked.
 */
export const setSubTaskDone = (
  taskId: string,
  subTaskId: string,
  isDone: boolean,
): Promise<Task> =>
  apiRequest<Task>(tasksRoutes.subTask(taskId, subTaskId), {
    method: 'PATCH',
    body: JSON.stringify({ isDone }),
  });
