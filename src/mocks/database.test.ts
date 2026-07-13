import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Folder, Task } from './data/fixtures';

// The mock database is a module-level singleton, so each test re-imports a
// fresh instance to avoid state leaking between assertions.
let databaseModule: typeof import('./database');

beforeEach(async (): Promise<void> => {
  vi.resetModules();
  databaseModule = await import('./database');
});

describe('user', () => {
  it('returns the seeded user', () => {
    const user = databaseModule.database.getUser();
    expect(user.id).toBe('user-1');
    expect(user.email).toBe('nelson@priolist.app');
  });

  it('merges partial updates into the current user', () => {
    const updated = databaseModule.database.updateUser({
      firstName: 'Alice',
    });
    expect(updated.firstName).toBe('Alice');
    expect(updated.lastName).toBe('Belgarde');
    expect(databaseModule.database.getUser().firstName).toBe('Alice');
  });
});

describe('folders', () => {
  it('lists the seeded folders', () => {
    expect(databaseModule.database.getFolders()).toHaveLength(3);
  });

  it('finds a folder by id', () => {
    const folder = databaseModule.database.getFolder('folder-1');
    expect(folder?.name).toBe('Perso');
  });

  it('returns undefined for an unknown folder id', () => {
    expect(databaseModule.database.getFolder('missing')).toBeUndefined();
  });

  it('adds a new folder', () => {
    const newFolder: Folder = {
      id: 'folder-new',
      name: 'Loisirs',
      color: '#000000',
      userId: 'user-1',
      taskCount: 0,
      createdAt: new Date().toISOString(),
    };
    databaseModule.database.addFolder(newFolder);
    expect(databaseModule.database.getFolders()).toHaveLength(4);
    expect(databaseModule.database.getFolder('folder-new')).toEqual(newFolder);
  });

  it('updates an existing folder', () => {
    const updated = databaseModule.database.updateFolder('folder-1', {
      name: 'Personnel',
    });
    expect(updated?.name).toBe('Personnel');
  });

  it('returns null when updating an unknown folder', () => {
    expect(
      databaseModule.database.updateFolder('missing', { name: 'x' }),
    ).toBeNull();
  });

  it('deletes an existing folder', () => {
    expect(databaseModule.database.deleteFolder('folder-1')).toBe(true);
    expect(databaseModule.database.getFolder('folder-1')).toBeUndefined();
  });

  it('returns false when deleting an unknown folder', () => {
    expect(databaseModule.database.deleteFolder('missing')).toBe(false);
  });
});

describe('tasks', () => {
  it('lists the seeded tasks', () => {
    expect(databaseModule.database.getTasks()).toHaveLength(9);
  });

  it('finds a task by id', () => {
    expect(databaseModule.database.getTask('task-1')?.title).toBe(
      'Finaliser la page de connexion',
    );
  });

  it('returns undefined for an unknown task id', () => {
    expect(databaseModule.database.getTask('missing')).toBeUndefined();
  });

  it('adds a new task at the front of the list', () => {
    const newTask: Task = {
      id: 'task-new',
      title: 'Nouvelle tâche',
      description: null,
      quadrant: 'secondary',
      folderId: null,
      userId: 'user-1',
      dueDate: null,
      isDone: false,
      deletedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    databaseModule.database.addTask(newTask);
    const tasks = databaseModule.database.getTasks();
    expect(tasks).toHaveLength(10);
    expect(tasks[0]).toEqual(newTask);
  });

  it('updates an existing task and refreshes updatedAt', () => {
    const before = databaseModule.database.getTask('task-1');
    const updated = databaseModule.database.updateTask('task-1', {
      isDone: true,
    });
    expect(updated?.isDone).toBe(true);
    expect(updated?.updatedAt).not.toBe(before?.updatedAt);
  });

  it('returns null when updating an unknown task', () => {
    expect(
      databaseModule.database.updateTask('missing', { isDone: true }),
    ).toBeNull();
  });

  it('removes a task entirely', () => {
    expect(databaseModule.database.removeTask('task-1')).toBe(true);
    expect(databaseModule.database.getTask('task-1')).toBeUndefined();
  });

  it('returns false when removing an unknown task', () => {
    expect(databaseModule.database.removeTask('missing')).toBe(false);
  });

  it('empties the trash by dropping soft-deleted tasks', () => {
    databaseModule.database.emptyTrash();
    const tasks = databaseModule.database.getTasks();
    expect(tasks.some((task) => task.deletedAt !== null)).toBe(false);
    expect(tasks.find((task) => task.id === 'task-9')).toBeUndefined();
  });
});

describe('subTasks', () => {
  it('lists sub-tasks belonging to a given task', () => {
    expect(databaseModule.database.getSubTasks('task-1')).toHaveLength(3);
  });

  it('returns an empty list for a task without sub-tasks', () => {
    expect(databaseModule.database.getSubTasks('task-2')).toEqual([]);
  });
});
