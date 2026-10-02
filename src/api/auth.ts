import type { User } from '../mocks/data/fixtures';
import { apiRequest } from './client';
import { authRoutes } from './routes';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthSession {
  token: string;
  user: User;
}

export const login = (credentials: LoginCredentials): Promise<AuthSession> =>
  apiRequest<AuthSession>(authRoutes.login(), {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
