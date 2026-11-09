import { http, HttpResponse } from 'msw';
import { userRoutes } from '../../api/routes';
import type { User } from '../../types/models';
import { MOCK_PASSWORD } from '../data/fixtures';
import { database } from '../database';
import { apiPattern, randomDelay } from '../utils';

export const userHandler = [
  // GET /user/me
  http.get(apiPattern(userRoutes.me()), async () => {
    await randomDelay(150, 400);
    return HttpResponse.json(database.getUser());
  }),

  // PATCH /user/me
  http.patch(apiPattern(userRoutes.me()), async ({ request }) => {
    await randomDelay(300, 600);
    const body = (await request.json()) as Partial<User>;
    return HttpResponse.json(database.updateUser(body));
  }),

  // PATCH /user/me/password
  http.patch(apiPattern(userRoutes.password()), async ({ request }) => {
    await randomDelay(300, 600);
    const body = (await request.json()) as {
      currentPassword?: string;
      newPassword?: string;
    };

    if (!body.currentPassword || !body.newPassword) {
      return HttpResponse.json(
        { message: 'Both passwords are required.' },
        { status: 422 },
      );
    }

    if (body.currentPassword !== MOCK_PASSWORD) {
      return HttpResponse.json(
        { message: 'Current password is incorrect.' },
        { status: 401 },
      );
    }

    return HttpResponse.json({ message: 'Password updated successfully.' });
  }),

  // DELETE /user/me
  http.delete(apiPattern(userRoutes.me()), async () => {
    await randomDelay(400, 800);
    return HttpResponse.json({ message: 'Account deleted.' });
  }),
];
