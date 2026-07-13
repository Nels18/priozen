import { http, HttpResponse } from 'msw';
import type { User } from '../data/fixtures';
import { database } from '../database';
import { randomDelay } from '../utils';

export const userHandler = [
  // GET /user/me
  http.get('*/user/me', async () => {
    await randomDelay(150, 400);
    return HttpResponse.json(database.getUser());
  }),

  // PATCH /user/me
  http.patch('*/user/me', async ({ request }) => {
    await randomDelay(300, 600);
    const body = (await request.json()) as Partial<User>;
    return HttpResponse.json(database.updateUser(body));
  }),

  // PATCH /user/me/password
  http.patch('*/user/me/password', async ({ request }) => {
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

    if (body.currentPassword !== 'password123') {
      return HttpResponse.json(
        { message: 'Current password is incorrect.' },
        { status: 401 },
      );
    }

    return HttpResponse.json({ message: 'Password updated successfully.' });
  }),

  // DELETE /user/me
  http.delete('*/user/me', async () => {
    await randomDelay(400, 800);
    return HttpResponse.json({ message: 'Account deleted.' });
  }),
];
