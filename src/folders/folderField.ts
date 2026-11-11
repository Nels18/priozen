import type { Folder } from '../types/models';

/** Loading state of the folder list (TanStack Query `status`). */
export type FoldersStatus = 'pending' | 'error' | 'success';

export type FolderFieldState =
  /** The list is loading: the task's folder can't be shown yet. */
  | { kind: 'loading' }
  /** The list failed to load: the field is locked, the value kept. */
  | { kind: 'unavailable'; hasFolder: boolean }
  /** Ready to choose; `folder` is null for "Aucun". */
  | { kind: 'ready'; folder: Folder | null };

/**
 * What the folder field can show. While the list is missing, the field never
 * falls back to "Aucun" for a task that has a folder: that would hide its
 * folder, and saving could not change it anyway since the value is kept.
 */
export const getFolderFieldState = (
  folderId: string | null,
  folders: Folder[],
  status: FoldersStatus,
): FolderFieldState => {
  if (status === 'pending') return { kind: 'loading' };
  if (status === 'error') {
    return { kind: 'unavailable', hasFolder: folderId !== null };
  }
  return {
    kind: 'ready',
    folder: folders.find((folder) => folder.id === folderId) ?? null,
  };
};
