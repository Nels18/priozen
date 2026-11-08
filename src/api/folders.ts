import type { Folder } from '../types/models';
import { apiRequest } from './client';
import { foldersRoutes } from './routes';

/** The user's folders. */
export const listFolders = (): Promise<Folder[]> =>
  apiRequest<Folder[]>(foldersRoutes.list());
