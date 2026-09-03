import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeDumbFolder } from './factories/folderFactory';
import { makeDumbSubTask } from './factories/subTaskFactory';
import { makeDumbTask } from './factories/taskFactory';
import { makeDumbUser } from './factories/userFactory';

// The mock database is a module-level singleton, so each test re-imports a
// fresh instance to avoid state leaking between assertions.
let databaseModule: typeof import('./database');

const expectedUser = makeDumbUser();

const expectedFolders = [
  makeDumbFolder({ taskCount: 4 }),
  makeDumbFolder({
    id: 'folder-2',
    name: 'Travail',
    color: '#F59E0B',
    taskCount: 6,
    createdAt: '2026-01-11T00:00:00.000Z',
  }),
  makeDumbFolder({
    id: 'folder-3',
    name: 'Priolist App',
    color: '#10B981',
    taskCount: 5,
    createdAt: '2026-01-12T00:00:00.000Z',
  }),
];
const [firstFolder] = expectedFolders;

const expectedTasks = [
  makeDumbTask({
    quadrant: 'critical',
    folderId: 'folder-3',
    description: 'Intégrer le formulaire avec validation et appel API.',
  }),
  makeDumbTask({
    id: 'task-2',
    title: 'Préparer la réunion client',
    quadrant: 'critical',
    folderId: 'folder-2',
    createdAt: '2026-04-19T09:00:00.000Z',
    updatedAt: '2026-04-19T09:00:00.000Z',
  }),
  makeDumbTask({
    id: 'task-3',
    title: 'Mettre en place les tests unitaires',
    description: 'Couvrir les composants Auth avec Vitest.',
    folderId: 'folder-3',
    createdAt: '2026-04-18T08:00:00.000Z',
    updatedAt: '2026-04-18T08:00:00.000Z',
  }),
  makeDumbTask({
    id: 'task-4',
    title: 'Rédiger la documentation technique',
    folderId: 'folder-3',
    createdAt: '2026-04-17T08:00:00.000Z',
    updatedAt: '2026-04-17T08:00:00.000Z',
  }),
  makeDumbTask({
    id: 'task-5',
    title: 'Répondre aux emails en attente',
    quadrant: 'delegate',
    createdAt: '2026-04-22T07:00:00.000Z',
    updatedAt: '2026-04-22T07:00:00.000Z',
  }),
  makeDumbTask({
    id: 'task-6',
    title: 'Trier les favoris du navigateur',
    quadrant: 'secondary',
    folderId: 'folder-1',
    createdAt: '2026-04-15T12:00:00.000Z',
    updatedAt: '2026-04-15T12:00:00.000Z',
  }),
  makeDumbTask({
    id: 'task-7',
    title: 'Setup CI/CD GitHub Actions',
    description: 'Configuration des workflows CI et release.',
    quadrant: 'critical',
    folderId: 'folder-3',
    isDone: true,
    createdAt: '2026-04-10T10:00:00.000Z',
    updatedAt: '2026-04-24T18:00:00.000Z',
  }),
  makeDumbTask({
    id: 'task-8',
    title: 'Configurer ESLint et Prettier',
    folderId: 'folder-3',
    isDone: true,
    createdAt: '2026-04-05T10:00:00.000Z',
    updatedAt: '2026-04-08T10:00:00.000Z',
  }),
  makeDumbTask({
    id: 'task-9',
    title: 'Ancienne tâche supprimée',
    quadrant: 'secondary',
    deletedAt: '2026-04-20T10:00:00.000Z',
    createdAt: '2026-04-01T10:00:00.000Z',
    updatedAt: '2026-04-20T10:00:00.000Z',
  }),
];
const [firstTask] = expectedTasks;
const secondTask = expectedTasks[1];
const trashedTask = expectedTasks.find((task) => task.deletedAt !== null)!;

const expectedSubTasks = [
  makeDumbSubTask({ isDone: true }),
  makeDumbSubTask({ id: 'subtask-2', title: 'Connexion API /auth/login' }),
  makeDumbSubTask({
    id: 'subtask-3',
    title: 'Gestion erreurs & états de chargement',
  }),
];
const firstTaskSubTasks = expectedSubTasks.filter(
  (subTask) => subTask.taskId === firstTask.id,
);

beforeEach(async (): Promise<void> => {
  vi.resetModules();
  databaseModule = await import('./database');
});

describe('user', () => {
  it('returns the seeded user', () => {
    const user = databaseModule.database.getUser();
    expect(user.id).toBe(expectedUser.id);
    expect(user.email).toBe(expectedUser.email);
  });

  it('merges partial updates into the current user', () => {
    const updated = databaseModule.database.updateUser({
      firstName: 'Alice',
    });
    expect(updated.firstName).toBe('Alice');
    expect(updated.lastName).toBe(expectedUser.lastName);
    expect(databaseModule.database.getUser().firstName).toBe('Alice');
  });
});

describe('folders', () => {
  it('lists the seeded folders', () => {
    expect(databaseModule.database.getFolders()).toHaveLength(
      expectedFolders.length,
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
    const newFolder = makeDumbFolder({
      id: 'folder-new',
      name: 'Loisirs',
      color: '#000000',
      userId: expectedUser.id,
      createdAt: new Date().toISOString(),
    });
    databaseModule.database.addFolder(newFolder);
    expect(databaseModule.database.getFolders()).toHaveLength(
      expectedFolders.length + 1,
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
    expect(databaseModule.database.getTasks()).toHaveLength(
      expectedTasks.length,
    );
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
    const newTask = makeDumbTask({
      id: 'task-new',
      title: 'Nouvelle tâche',
      quadrant: 'secondary',
      userId: expectedUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    databaseModule.database.addTask(newTask);
    const tasks = databaseModule.database.getTasks();
    expect(tasks).toHaveLength(expectedTasks.length + 1);
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
