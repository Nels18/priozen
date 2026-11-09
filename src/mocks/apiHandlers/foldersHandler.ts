import { http, HttpResponse } from 'msw';
import { foldersRoutes } from '../../api/routes';
import type { Folder } from '../../types/models';
import { MOCK_USER_ID } from '../data/fixtures';
import { database } from '../database';
import { apiPattern, createId, randomDelay } from '../utils';

export const foldersHandler = [
  // GET /folders
  http.get(apiPattern(foldersRoutes.list()), async () => {
    await randomDelay(200, 500);
    return HttpResponse.json(database.getFolders());
  }),

  // GET /folders/:id
  http.get(apiPattern(foldersRoutes.detail(':id')), async ({ params }) => {
    await randomDelay(150, 400);
    const folder = database.getFolder(params.id as string);

    if (!folder) {
      return HttpResponse.json(
        { message: 'Folder not found.' },
        { status: 404 },
      );
    }

    return HttpResponse.json(folder);
  }),

  // POST /folders
  http.post(apiPattern(foldersRoutes.list()), async ({ request }) => {
    await randomDelay(300, 600);
    const body = (await request.json()) as Partial<Folder>;

    if (!body.name?.trim()) {
      return HttpResponse.json(
        { message: 'Name is required.' },
        { status: 422 },
      );
    }

    const newFolder: Folder = {
      id: createId('folder'),
      name: body.name,
      color: body.color ?? '#6366F1',
      userId: MOCK_USER_ID,
      taskCount: 0,
      createdAt: new Date().toISOString(),
    };

    return HttpResponse.json(database.addFolder(newFolder), { status: 201 });
  }),

  // PATCH /folders/:id
  http.patch(
    apiPattern(foldersRoutes.detail(':id')),
    async ({ params, request }) => {
      await randomDelay(200, 500);
      const body = (await request.json()) as Partial<Folder>;
      const updated = database.updateFolder(params.id as string, body);

      if (!updated) {
        return HttpResponse.json(
          { message: 'Folder not found.' },
          { status: 404 },
        );
      }

      return HttpResponse.json(updated);
    },
  ),

  // DELETE /folders/:id
  http.delete(apiPattern(foldersRoutes.detail(':id')), async ({ params }) => {
    await randomDelay(200, 500);
    const isRemoved = database.deleteFolder(params.id as string);

    if (!isRemoved) {
      return HttpResponse.json(
        { message: 'Folder not found.' },
        { status: 404 },
      );
    }

    return HttpResponse.json({ message: 'Folder deleted.' });
  }),
];
