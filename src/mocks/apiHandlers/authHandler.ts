import { http, HttpResponse } from 'msw';
import { authRoutes } from '../../api/routes';
import { MOCK_TOKEN, mockUser } from '../data/fixtures';
import { database } from '../database';
import { createId, randomDelay } from '../utils';

export const authHandler = [
  // POST /auth/login
  http.post(`*${authRoutes.login()}`, async ({ request }) => {
    await randomDelay(300, 700);
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    if (!body.email || !body.password) {
      return HttpResponse.json(
        { message: 'Email and password are required.' },
        { status: 422 },
      );
    }

    if (body.email !== mockUser.email || body.password !== 'password123') {
      return HttpResponse.json(
        { message: 'Invalid credentials.' },
        { status: 401 },
      );
    }

    return HttpResponse.json({ token: MOCK_TOKEN, user: database.getUser() });
  }),

  // POST /auth/register
  http.post(`*${authRoutes.register()}`, async ({ request }) => {
    await randomDelay(400, 800);
    const body = (await request.json()) as {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
    };

    if (!body.email || !body.password || !body.firstName || !body.lastName) {
      return HttpResponse.json(
        { message: 'All fields are required.' },
        { status: 422 },
      );
    }

    if (body.email === mockUser.email) {
      return HttpResponse.json(
        { message: 'An account with this email already exists.' },
        { status: 409 },
      );
    }

    const newUser = {
      id: createId('user'),
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      createdAt: new Date().toISOString(),
    };

    return HttpResponse.json(
      { token: MOCK_TOKEN, user: newUser },
      { status: 201 },
    );
  }),

  // POST /auth/forgot-password
  http.post(`*${authRoutes.forgotPassword()}`, async () => {
    await randomDelay(400, 800);
    // Always 200 to avoid email enumeration
    return HttpResponse.json({
      message: 'If this email exists, a reset link has been sent.',
    });
  }),

  // POST /auth/reset-password
  http.post(`*${authRoutes.resetPassword()}`, async ({ request }) => {
    await randomDelay(300, 600);
    const body = (await request.json()) as {
      token?: string;
      password?: string;
    };

    if (!body.token || !body.password) {
      return HttpResponse.json(
        { message: 'Token and password are required.' },
        { status: 422 },
      );
    }

    if (body.token === 'invalid-token') {
      return HttpResponse.json(
        { message: 'Token is invalid or has expired.' },
        { status: 422 },
      );
    }

    return HttpResponse.json({ message: 'Password reset successfully.' });
  }),

  // POST /auth/logout
  http.post(`*${authRoutes.logout()}`, async () => {
    await randomDelay(100, 300);
    return HttpResponse.json({ message: 'Logged out.' });
  }),
];
