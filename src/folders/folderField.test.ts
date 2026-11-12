import { describe, expect, it } from 'vitest';
import type { Folder } from '../types/models';
import { getFolderFieldState } from './folderField';

const work: Folder = {
  id: 'folder-1',
  name: 'Travail',
  color: '#6366F1',
  userId: 'user-1',
  taskCount: 3,
  createdAt: '2026-10-01T00:00:00.000Z',
};

describe('getFolderFieldState', () => {
  it('waits for the list instead of showing "Aucun"', (): void => {
    expect(getFolderFieldState('folder-1', [], 'pending')).toEqual({
      kind: 'loading',
    });
  });

  it('locks the field when the list fails, telling whether a folder is set', (): void => {
    expect(getFolderFieldState('folder-1', [], 'error')).toEqual({
      kind: 'unavailable',
      hasFolder: true,
    });
    expect(getFolderFieldState(null, [], 'error')).toEqual({
      kind: 'unavailable',
      hasFolder: false,
    });
  });

  it('shows the task folder once the list is loaded', (): void => {
    expect(getFolderFieldState('folder-1', [work], 'success')).toEqual({
      kind: 'ready',
      folder: work,
    });
  });

  it('shows "Aucun" for a task without folder', (): void => {
    expect(getFolderFieldState(null, [work], 'success')).toEqual({
      kind: 'ready',
      folder: null,
    });
  });
});
