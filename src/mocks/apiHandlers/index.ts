import { authHandler } from './authHandler';
import { foldersHandler } from './foldersHandler';
import { tasksHandler } from './tasksHandler';
import { userHandler } from './userHandler';

export const apiHandlers = [
  ...authHandler,
  ...tasksHandler,
  ...foldersHandler,
  ...userHandler,
];
