import type { Task } from '../types/models';
import { apiRequest } from './client';
import { tasksRoutes } from './routes';

/** Active (non-deleted) tasks, sorted by Eisenhower priority. */
export const listTasks = (): Promise<Task[]> =>
  apiRequest<Task[]>(tasksRoutes.list());
