import { http, HttpResponse } from 'msw';
import { tasksRoutes } from '../../api/routes';
import type { Task } from '../data/fixtures';
import { database } from '../database';
import { createId, randomDelay } from '../utils';

export const tasksHandler = [
  // GET /tasks
  http.get(`*${tasksRoutes.list()}`, async ({ request }) => {
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
      const order: Record<string, number> = {
        critical: 0,
        schedule: 1,
        delegate: 2,
        secondary: 3,
      };
      result.sort((a, b) => order[a.quadrant] - order[b.quadrant]);
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
  http.get(`*${tasksRoutes.detail(':id')}`, async ({ params }) => {
    await randomDelay(150, 400);
    const task = database.getTask(params.id);

    if (!task) {
      return HttpResponse.json({ message: 'Task not found.' }, { status: 404 });
    }

    return HttpResponse.json(task);
  }),

  // POST /tasks
  http.post(`*${tasksRoutes.list()}`, async ({ request }) => {
    await randomDelay(300, 600);
    const body = (await request.json()) as Partial<Task>;

    if (!body.title?.trim()) {
      return HttpResponse.json(
        { message: 'Title is required.' },
        { status: 422 },
      );
    }

    const newTask: Task = {
      id: createId('task'),
      title: body.title,
      description: body.description ?? null,
      quadrant: body.quadrant ?? 'schedule',
      folderId: body.folderId ?? null,
      userId: 'user-1',
      dueDate: body.dueDate ?? null,
      isDone: false,
      deletedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json(database.addTask(newTask), { status: 201 });
  }),

  // PATCH /tasks/:id
  http.patch(`*${tasksRoutes.detail(':id')}`, async ({ params, request }) => {
    await randomDelay(200, 500);
    const body = (await request.json()) as Partial<Task>;
    const updated = database.updateTask(params.id, body);

    if (!updated) {
      return HttpResponse.json({ message: 'Task not found.' }, { status: 404 });
    }

    return HttpResponse.json(updated);
  }),

  // DELETE /tasks/:id — soft delete (move to trash)
  http.delete(`*${tasksRoutes.detail(':id')}`, async ({ params }) => {
    await randomDelay(200, 500);
    const updated = database.updateTask(params.id, {
      deletedAt: new Date().toISOString(),
    });

    if (!updated) {
      return HttpResponse.json({ message: 'Task not found.' }, { status: 404 });
    }

    return HttpResponse.json({ message: 'Task moved to trash.' });
  }),

  // POST /tasks/:id/restore
  http.post(`*${tasksRoutes.restore(':id')}`, async ({ params }) => {
    await randomDelay(200, 500);
    const updated = database.updateTask(params.id, {
      deletedAt: null,
    });

    if (!updated) {
      return HttpResponse.json({ message: 'Task not found.' }, { status: 404 });
    }

    return HttpResponse.json(updated);
  }),

  // DELETE /tasks/:id/permanent
  http.delete(`*${tasksRoutes.permanent(':id')}`, async ({ params }) => {
    await randomDelay(200, 500);
    const isRemoved = database.removeTask(params.id);

    if (!isRemoved) {
      return HttpResponse.json({ message: 'Task not found.' }, { status: 404 });
    }

    return HttpResponse.json({ message: 'Task permanently deleted.' });
  }),

  // DELETE /tasks/trash/empty
  http.delete(`*${tasksRoutes.trashEmpty()}`, async () => {
    await randomDelay(300, 600);
    database.emptyTrash();
    return HttpResponse.json({ message: 'Trash emptied.' });
  }),
];
