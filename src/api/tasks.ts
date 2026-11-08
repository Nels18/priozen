import type { Task } from '../types/models';
import { apiRequest } from './client';
import { tasksRoutes } from './routes';

/** Fields a client may change on a task (`PATCH /tasks/:id`). */
export type TaskUpdate = Partial<
  Pick<
    Task,
    'title' | 'description' | 'quadrant' | 'folderId' | 'dueDate' | 'isDone'
  >
>;

/** Active (non-deleted) tasks, sorted by Eisenhower priority. */
export const listTasks = (): Promise<Task[]> =>
  apiRequest<Task[]>(tasksRoutes.list());

/** Partial update; resolves with the task as saved by the server. */
export const updateTask = (id: string, changes: TaskUpdate): Promise<Task> =>
  apiRequest<Task>(tasksRoutes.detail(id), {
    method: 'PATCH',
    body: JSON.stringify(changes),
  });
