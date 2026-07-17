import {
  mockFolders,
  mockSubTasks,
  mockTasks,
  mockUser,
  type Folder,
  type SubTask,
  type Task,
  type User,
} from './data/fixtures';
import { makeFolders } from './factories/folderFactory';
import { makeSubTasksForTasks } from './factories/subTaskFactory';
import { makeTasks } from './factories/taskFactory';

const isTestEnv = process.env.NODE_ENV === 'test';
const DEV_FOLDER_COUNT = 6;
const DEV_TASK_COUNT = 30;

interface Database {
  getUser: () => User;
  updateUser: (data: Partial<User>) => User;
  getFolders: () => Folder[];
  getFolder: (id: string) => Folder | undefined;
  addFolder: (folder: Folder) => Folder;
  updateFolder: (id: string, data: Partial<Folder>) => Folder | null;
  deleteFolder: (id: string) => boolean;
  getTasks: () => Task[];
  getTask: (id: string) => Task | undefined;
  addTask: (task: Task) => Task;
  updateTask: (id: string, data: Partial<Task>) => Task | null;
  removeTask: (id: string) => boolean;
  emptyTrash: () => void;
  getSubTasks: (taskId: string) => SubTask[];
  reset: () => Database;
}

const setup = (): Database => {
  // Deep copies of seed data — isolated per session
  let user: User = { ...mockUser };
  const folders: Folder[] = isTestEnv
    ? mockFolders.map((f) => ({ ...f }))
    : makeFolders(DEV_FOLDER_COUNT);
  let tasks: Task[] = isTestEnv
    ? mockTasks.map((t) => ({ ...t }))
    : makeTasks(DEV_TASK_COUNT, folders);
  const subTasks: SubTask[] = isTestEnv
    ? mockSubTasks.map((s) => ({ ...s }))
    : makeSubTasksForTasks(tasks);

  if (!isTestEnv) {
    folders.forEach((folder) => {
      folder.taskCount = tasks.filter((t) => t.folderId === folder.id).length;
    });
  }

  return {
    // ─── User ────────────────────────────────────────────────────────────────
    getUser: (): User => user,
    updateUser: (data: Partial<User>): User => {
      user = { ...user, ...data };
      return user;
    },

    // ─── Folders ─────────────────────────────────────────────────────────────
    getFolders: (): Folder[] => folders,
    getFolder: (id: string): Folder | undefined =>
      folders.find((f) => f.id === id),
    addFolder: (folder: Folder): Folder => {
      folders.push(folder);
      return folder;
    },
    updateFolder: (id: string, data: Partial<Folder>): Folder | null => {
      const i = folders.findIndex((f) => f.id === id);
      if (i === -1) return null;
      folders[i] = { ...folders[i], ...data };
      return folders[i];
    },
    deleteFolder: (id: string): boolean => {
      const i = folders.findIndex((f) => f.id === id);
      if (i === -1) return false;
      folders.splice(i, 1);
      return true;
    },

    // ─── Tasks ───────────────────────────────────────────────────────────────
    getTasks: (): Task[] => tasks,
    getTask: (id: string): Task | undefined => tasks.find((t) => t.id === id),
    addTask: (task: Task): Task => {
      tasks.unshift(task);
      return task;
    },
    updateTask: (id: string, data: Partial<Task>): Task | null => {
      const i = tasks.findIndex((t) => t.id === id);
      if (i === -1) return null;
      tasks[i] = { ...tasks[i], ...data, updatedAt: new Date().toISOString() };
      return tasks[i];
    },
    removeTask: (id: string): boolean => {
      const i = tasks.findIndex((t) => t.id === id);
      if (i === -1) return false;
      tasks.splice(i, 1);
      return true;
    },
    emptyTrash: (): void => {
      tasks = tasks.filter((t) => t.deletedAt === null);
    },

    // ─── SubTasks ────────────────────────────────────────────────────────────
    getSubTasks: (taskId: string): SubTask[] =>
      subTasks.filter((s) => s.taskId === taskId),

    // ─── Test helpers ────────────────────────────────────────────────────────
    reset: (): Database => setup(),
  };
};

export const database = setup();
