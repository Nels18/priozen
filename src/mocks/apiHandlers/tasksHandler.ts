import { http, HttpResponse } from 'msw';
import { tasksRoutes } from '../../api/routes';
import type { SubTask, Task } from '../../types/models';
import { EISENHOWER_QUADRANTS } from '../../types/models';
import { MOCK_USER_ID } from '../data/fixtures';
import { database } from '../database';
import { apiPattern, createId, randomDelay } from '../utils';

/** A sub-task as the task modal sends it: no `id` means a new one. */
interface SubTaskBody {
  id?: string;
  title?: string;
  isDone?: boolean;
}

type TaskBody = Partial<Omit<Task, 'subTasks'>> & { subTasks?: SubTaskBody[] };

/**
 * Turns the checklist sent with a task into the saved one, which replaces the
 * old one: a sub-task without `id` is created, one with an `id` is kept with
 * its new title and state, and one left out is deleted. Returns an error
 * message for an empty title, or an `id` the task doesn't have or sent twice.
 */
const toSubTasks = (
  taskId: string,
  body: SubTaskBody[],
  current: SubTask[],
): SubTask[] | string => {
  const saved: SubTask[] = [];
  for (const item of body) {
    const title = item.title?.trim();
    if (!title) return 'Sub-task title is required.';
    if (item.id !== undefined && !current.some((s) => s.id === item.id)) {
      return 'Unknown sub-task.';
    }
    if (item.id !== undefined && saved.some((s) => s.id === item.id)) {
      return 'Duplicate sub-task.';
    }
    saved.push({
      id: item.id ?? createId('subtask'),
      taskId,
      title,
      isDone: item.isDone ?? false,
    });
  }
  return saved;
};

const unprocessable = (message: string): Response =>
  HttpResponse.json({ message }, { status: 422 });

export const tasksHandler = [
  // GET /tasks
  http.get(apiPattern(tasksRoutes.list()), async ({ request }) => {
    await randomDelay(200, 600);
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase();
    const folderId = url.searchParams.get('folder_id');
    const sort = url.searchParams.get('sort') ?? 'priority';
    const isIncludeDeleted = url.searchParams.get('deleted') === 'true';

    let result = database
      .getTasks()
      .filter((t) =>
        isIncludeDeleted ? t.deletedAt !== null : t.deletedAt === null,
      );

    if (folderId) result = result.filter((t) => t.folderId === folderId);
    if (search)
      result = result.filter((t) => t.title.toLowerCase().includes(search));

    if (sort === 'priority') {
      const rank = (task: Task): number =>
        EISENHOWER_QUADRANTS.indexOf(task.quadrant);
      result.sort((a, b) => rank(a) - rank(b));
    } else if (sort === 'date') {
      result.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
    } else if (sort === 'name') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return HttpResponse.json(result);
  }),

  // GET /tasks/:id
  http.get(apiPattern(tasksRoutes.detail(':id')), async ({ params }) => {
    await randomDelay(150, 400);
    const task = database.getTask(params.id as string);

    if (!task) {
      return HttpResponse.json({ message: 'Task not found.' }, { status: 404 });
    }

    return HttpResponse.json(task);
  }),

  // POST /tasks
  http.post(apiPattern(tasksRoutes.list()), async ({ request }) => {
    await randomDelay(300, 600);
    const body = (await request.json()) as TaskBody;

    if (!body.title?.trim()) {
      return HttpResponse.json(
        { message: 'Title is required.' },
        { status: 422 },
      );
    }

    const id = createId('task');
    // A new task has no sub-task yet: any `id` sent is unknown.
    const subTasks = toSubTasks(id, body.subTasks ?? [], []);
    if (typeof subTasks === 'string') return unprocessable(subTasks);

    const newTask: Task = {
      id,
      title: body.title,
      description: body.description ?? null,
      quadrant: body.quadrant ?? 'schedule',
      folderId: body.folderId ?? null,
      userId: MOCK_USER_ID,
      dueDate: body.dueDate ?? null,
      isDone: false,
      deletedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subTasks,
    };

    return HttpResponse.json(database.addTask(newTask), { status: 201 });
  }),

  // PATCH /tasks/:id — `subTasks`, when sent, replaces the whole checklist.
  // Checking the task leaves its sub-tasks as they are.
  http.patch(
    apiPattern(tasksRoutes.detail(':id')),
    async ({ params, request }) => {
      await randomDelay(200, 500);
      const id = params.id as string;
      const { subTasks: subTasksBody, ...body } =
        (await request.json()) as TaskBody;
      const task = database.getTask(id);

      if (!task) {
        return HttpResponse.json(
          { message: 'Task not found.' },
          { status: 404 },
        );
      }

      const changes: Partial<Task> = { ...body };
      if (subTasksBody !== undefined) {
        const subTasks = toSubTasks(id, subTasksBody, task.subTasks);
        if (typeof subTasks === 'string') return unprocessable(subTasks);
        changes.subTasks = subTasks;
      }

      return HttpResponse.json(database.updateTask(id, changes));
    },
  ),

  // PATCH /tasks/:id/subtasks/:subTaskId — checks or unchecks one sub-task
  // and answers with the whole task. The task itself is not checked.
  http.patch(
    apiPattern(tasksRoutes.subTask(':id', ':subTaskId')),
    async ({ params, request }) => {
      await randomDelay(150, 400);
      const { isDone } = (await request.json()) as { isDone?: unknown };

      if (typeof isDone !== 'boolean') {
        return unprocessable('isDone must be a boolean.');
      }

      const updated = database.setSubTaskDone(
        params.id as string,
        params.subTaskId as string,
        isDone,
      );

      if (!updated) {
        return HttpResponse.json(
          { message: 'Sub-task not found.' },
          { status: 404 },
        );
      }

      return HttpResponse.json(updated);
    },
  ),

  // DELETE /tasks/:id — soft delete (move to trash)
  http.delete(apiPattern(tasksRoutes.detail(':id')), async ({ params }) => {
    await randomDelay(200, 500);
    const updated = database.updateTask(params.id as string, {
      deletedAt: new Date().toISOString(),
    });

    if (!updated) {
      return HttpResponse.json({ message: 'Task not found.' }, { status: 404 });
    }

    return HttpResponse.json({ message: 'Task moved to trash.' });
  }),

  // POST /tasks/:id/restore
  http.post(apiPattern(tasksRoutes.restore(':id')), async ({ params }) => {
    await randomDelay(200, 500);
    const updated = database.updateTask(params.id as string, {
      deletedAt: null,
    });

    if (!updated) {
      return HttpResponse.json({ message: 'Task not found.' }, { status: 404 });
    }

    return HttpResponse.json(updated);
  }),

  // DELETE /tasks/:id/permanent
  http.delete(apiPattern(tasksRoutes.permanent(':id')), async ({ params }) => {
    await randomDelay(200, 500);
    const isRemoved = database.removeTask(params.id as string);

    if (!isRemoved) {
      return HttpResponse.json({ message: 'Task not found.' }, { status: 404 });
    }

    return HttpResponse.json({ message: 'Task permanently deleted.' });
  }),

  // DELETE /tasks/trash/empty
  http.delete(apiPattern(tasksRoutes.trashEmpty()), async () => {
    await randomDelay(300, 600);
    database.emptyTrash();
    return HttpResponse.json({ message: 'Trash emptied.' });
  }),
];
