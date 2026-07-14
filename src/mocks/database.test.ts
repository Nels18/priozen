import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Folder, Task } from './data/fixtures';
import {
  mockFolders,
  mockSubTasks,
  mockTasks,
  mockUser,
} from './data/fixtures';

// The mock database is a module-level singleton, so each test re-imports a
// fresh instance to avoid state leaking between assertions.
let databaseModule: typeof import('./database');

const [firstFolder] = mockFolders;
const [firstTask] = mockTasks;
const secondTask = mockTasks[1];
const trashedTask = mockTasks.find((task) => task.deletedAt !== null)!;
const firstTaskSubTasks = mockSubTasks.filter(
  (subTask) => subTask.taskId === firstTask.id,
);

beforeEach(async (): Promise<void> => {
  vi.resetModules();
  databaseModule = await import('./database');
});

describe('user', () => {
  it('returns the seeded user', () => {
    const user = databaseModule.database.getUser();
    expect(user.id).toBe(mockUser.id);
    expect(user.email).toBe(mockUser.email);
  });

  it('merges partial updates into the current user', () => {
    const updated = databaseModule.database.updateUser({
      firstName: 'Alice',
    });
    expect(updated.firstName).toBe('Alice');
    expect(updated.lastName).toBe(mockUser.lastName);
    expect(databaseModule.database.getUser().firstName).toBe('Alice');
  });
});

describe('folders', () => {
  it('lists the seeded folders', () => {
    expect(databaseModule.database.getFolders()).toHaveLength(
      mockFolders.length,
    );
  });

  it('finds a folder by id', () => {
    const folder = databaseModule.database.getFolder(firstFolder.id);
    expect(folder?.name).toBe(firstFolder.name);
  });

  it('returns undefined for an unknown folder id', () => {
    expect(databaseModule.database.getFolder('missing')).toBeUndefined();
  });

  it('adds a new folder', () => {
    const newFolder: Folder = {
      id: 'folder-new',
      name: 'Loisirs',
      color: '#000000',
      userId: mockUser.id,
      taskCount: 0,
      createdAt: new Date().toISOString(),
    };
    databaseModule.database.addFolder(newFolder);
    expect(databaseModule.database.getFolders()).toHaveLength(
      mockFolders.length + 1,
    );
    expect(databaseModule.database.getFolder('folder-new')).toEqual(newFolder);
  });

  it('updates an existing folder', () => {
    const updated = databaseModule.database.updateFolder(firstFolder.id, {
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
    expect(databaseModule.database.deleteFolder(firstFolder.id)).toBe(true);
    expect(databaseModule.database.getFolder(firstFolder.id)).toBeUndefined();
  });

  it('returns false when deleting an unknown folder', () => {
    expect(databaseModule.database.deleteFolder('missing')).toBe(false);
  });
});

describe('tasks', () => {
  it('lists the seeded tasks', () => {
    expect(databaseModule.database.getTasks()).toHaveLength(mockTasks.length);
  });

  it('finds a task by id', () => {
    expect(databaseModule.database.getTask(firstTask.id)?.title).toBe(
      firstTask.title,
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
      userId: mockUser.id,
      dueDate: null,
      isDone: false,
      deletedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    databaseModule.database.addTask(newTask);
    const tasks = databaseModule.database.getTasks();
    expect(tasks).toHaveLength(mockTasks.length + 1);
    expect(tasks[0]).toEqual(newTask);
  });

  it('updates an existing task and refreshes updatedAt', () => {
    const before = databaseModule.database.getTask(firstTask.id);
    const updated = databaseModule.database.updateTask(firstTask.id, {
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
    expect(databaseModule.database.removeTask(firstTask.id)).toBe(true);
    expect(databaseModule.database.getTask(firstTask.id)).toBeUndefined();
  });

  it('returns false when removing an unknown task', () => {
    expect(databaseModule.database.removeTask('missing')).toBe(false);
  });

  it('empties the trash by dropping soft-deleted tasks', () => {
    databaseModule.database.emptyTrash();
    const tasks = databaseModule.database.getTasks();
    expect(tasks.some((task) => task.deletedAt !== null)).toBe(false);
    expect(tasks.find((task) => task.id === trashedTask.id)).toBeUndefined();
  });
});

describe('subTasks', () => {
  it('lists sub-tasks belonging to a given task', () => {
    expect(databaseModule.database.getSubTasks(firstTask.id)).toHaveLength(
      firstTaskSubTasks.length,
    );
  });

  it('returns an empty list for a task without sub-tasks', () => {
    expect(databaseModule.database.getSubTasks(secondTask.id)).toEqual([]);
  });
});
