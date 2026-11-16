import { FOLDER_COLOR } from '../../theme/folderColors';
import type { Folder, SubTask, Task, User } from '../../types/models';
import { DAY_MS } from '../utils';

// ─── Mock credentials ─────────────────────────────────────────────────────────

/** The only user of the mocked API; every mocked entity belongs to them. */
export const MOCK_USER_ID = 'user-1';
/** Password accepted by POST /auth/login (and the password-change check). */
export const MOCK_PASSWORD = 'password123';

// ─── Users ────────────────────────────────────────────────────────────────────

export const mockUser: User = {
  id: MOCK_USER_ID,
  firstName: 'Martin',
  lastName: 'Dupont',
  email: 'martin@priozen.app',
  createdAt: '2026-01-01T00:00:00.000Z',
};

// ─── Folders ──────────────────────────────────────────────────────────────────

export const mockFolders: Folder[] = [
  {
    id: 'folder-1',
    name: 'Perso',
    color: FOLDER_COLOR.pink,
    userId: MOCK_USER_ID,
    taskCount: 4,
    createdAt: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 'folder-2',
    name: 'Travail',
    color: FOLDER_COLOR.sky,
    userId: MOCK_USER_ID,
    taskCount: 6,
    createdAt: '2026-01-11T00:00:00.000Z',
  },
  {
    id: 'folder-3',
    name: 'Priozen App',
    color: FOLDER_COLOR.teal,
    userId: MOCK_USER_ID,
    taskCount: 5,
    createdAt: '2026-01-12T00:00:00.000Z',
  },
];

// ─── Tasks ────────────────────────────────────────────────────────────────────

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - DAY_MS).toISOString().split('T')[0];
const nextWeek = new Date(Date.now() + 7 * DAY_MS).toISOString().split('T')[0];

/** Sub-tasks of task-1: 3, 1 done. */
export const mockSubTasks: SubTask[] = [
  {
    id: 'subtask-1',
    taskId: 'task-1',
    title: 'Intégration maquette Figma',
    isDone: true,
  },
  {
    id: 'subtask-2',
    taskId: 'task-1',
    title: 'Connexion API /auth/login',
    isDone: false,
  },
  {
    id: 'subtask-3',
    taskId: 'task-1',
    title: 'Gestion erreurs & états de chargement',
    isDone: false,
  },
];

export const mockTasks: Task[] = [
  // Critical (urgent + important)
  {
    id: 'task-1',
    title: 'Finaliser la page de connexion',
    description: 'Intégrer le formulaire avec validation et appel API.',
    quadrant: 'critical',
    folderId: 'folder-3',
    userId: MOCK_USER_ID,
    dueDate: today,
    isDone: false,
    deletedAt: null,
    createdAt: '2026-04-20T10:00:00.000Z',
    updatedAt: '2026-04-20T10:00:00.000Z',
    subTasks: mockSubTasks,
  },
  {
    id: 'task-2',
    title: 'Préparer la réunion client',
    description: null,
    quadrant: 'critical',
    folderId: 'folder-2',
    userId: MOCK_USER_ID,
    dueDate: yesterday,
    isDone: false,
    deletedAt: null,
    createdAt: '2026-04-19T09:00:00.000Z',
    updatedAt: '2026-04-19T09:00:00.000Z',
    subTasks: [],
  },
  // Schedule (important, not urgent)
  {
    id: 'task-3',
    title: 'Mettre en place les tests unitaires',
    description: 'Couvrir les composants Auth avec Vitest.',
    quadrant: 'schedule',
    folderId: 'folder-3',
    userId: MOCK_USER_ID,
    dueDate: nextWeek,
    isDone: false,
    deletedAt: null,
    createdAt: '2026-04-18T08:00:00.000Z',
    updatedAt: '2026-04-18T08:00:00.000Z',
    subTasks: [],
  },
  {
    id: 'task-4',
    title: 'Rédiger la documentation technique',
    description: null,
    quadrant: 'schedule',
    folderId: 'folder-3',
    userId: MOCK_USER_ID,
    dueDate: nextWeek,
    isDone: false,
    deletedAt: null,
    createdAt: '2026-04-17T08:00:00.000Z',
    updatedAt: '2026-04-17T08:00:00.000Z',
    subTasks: [],
  },
  // Delegate (urgent, not important)
  {
    id: 'task-5',
    title: 'Répondre aux emails en attente',
    description: null,
    quadrant: 'delegate',
    folderId: null,
    userId: MOCK_USER_ID,
    dueDate: today,
    isDone: false,
    deletedAt: null,
    createdAt: '2026-04-22T07:00:00.000Z',
    updatedAt: '2026-04-22T07:00:00.000Z',
    subTasks: [],
  },
  // Secondary (not urgent, not important)
  {
    id: 'task-6',
    title: 'Trier les favoris du navigateur',
    description: null,
    quadrant: 'secondary',
    folderId: 'folder-1',
    userId: MOCK_USER_ID,
    dueDate: null,
    isDone: false,
    deletedAt: null,
    createdAt: '2026-04-15T12:00:00.000Z',
    updatedAt: '2026-04-15T12:00:00.000Z',
    subTasks: [],
  },
  // Done
  {
    id: 'task-7',
    title: 'Setup CI/CD GitHub Actions',
    description: 'Configuration des workflows CI et release.',
    quadrant: 'critical',
    folderId: 'folder-3',
    userId: MOCK_USER_ID,
    dueDate: '2026-04-24T00:00:00.000Z',
    isDone: true,
    deletedAt: null,
    createdAt: '2026-04-10T10:00:00.000Z',
    updatedAt: '2026-04-24T18:00:00.000Z',
    subTasks: [],
  },
  {
    id: 'task-8',
    title: 'Configurer ESLint et Prettier',
    description: null,
    quadrant: 'schedule',
    folderId: 'folder-3',
    userId: MOCK_USER_ID,
    dueDate: null,
    isDone: true,
    deletedAt: null,
    createdAt: '2026-04-05T10:00:00.000Z',
    updatedAt: '2026-04-08T10:00:00.000Z',
    subTasks: [],
  },
  // Trashed
  {
    id: 'task-9',
    title: 'Ancienne tâche supprimée',
    description: null,
    quadrant: 'secondary',
    folderId: null,
    userId: MOCK_USER_ID,
    dueDate: null,
    isDone: false,
    deletedAt: '2026-04-20T10:00:00.000Z',
    createdAt: '2026-04-01T10:00:00.000Z',
    updatedAt: '2026-04-20T10:00:00.000Z',
    subTasks: [],
  },
];

// ─── Auth token ────────────────────────────────────────────────────────────────

export const MOCK_TOKEN = 'mock-jwt-token-priozen-dev';
