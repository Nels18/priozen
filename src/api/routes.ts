// Single source of truth for API endpoint paths, shared between the MSW
// mocks and the real API client once the backend is ready — keeps both in
// sync and avoids duplicating URL strings across handlers and tests.

export const authRoutes = {
  login: (): string => '/auth/login',
  register: (): string => '/auth/register',
  forgotPassword: (): string => '/auth/forgot-password',
  resetPassword: (): string => '/auth/reset-password',
  logout: (): string => '/auth/logout',
};

export const tasksRoutes = {
  list: (): string => '/tasks',
  detail: (id: string): string => `/tasks/${id}`,
  restore: (id: string): string => `/tasks/${id}/restore`,
  permanent: (id: string): string => `/tasks/${id}/permanent`,
  trashEmpty: (): string => '/tasks/trash/empty',
};

export const foldersRoutes = {
  list: (): string => '/folders',
  detail: (id: string): string => `/folders/${id}`,
};

export const userRoutes = {
  me: (): string => '/user/me',
  password: (): string => '/user/me/password',
};
