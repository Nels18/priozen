export type EisenhowerQuadrant =
  'critical' | 'schedule' | 'delegate' | 'secondary';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  userId: string;
  taskCount: number;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  quadrant: EisenhowerQuadrant;
  folderId: string | null;
  userId: string;
  dueDate: string | null;
  isDone: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubTask {
  id: string;
  taskId: string;
  title: string;
  isDone: boolean;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export const mockUser: User = {
  id: 'user-1',
  firstName: 'Nelson',
  lastName: 'Belgarde',
  email: 'nelson@priozen.app',
  createdAt: '2026-01-01T00:00:00.000Z',
};

// ─── Folders ──────────────────────────────────────────────────────────────────

export const mockFolders: Folder[] = [
  {
    id: 'folder-1',
    name: 'Perso',
    color: '#6366F1',
    userId: 'user-1',
    taskCount: 4,
    createdAt: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 'folder-2',
    name: 'Travail',
    color: '#F59E0B',
    userId: 'user-1',
    taskCount: 6,
    createdAt: '2026-01-11T00:00:00.000Z',
  },
  {
    id: 'folder-3',
    name: 'Priozen App',
    color: '#10B981',
    userId: 'user-1',
    taskCount: 5,
    createdAt: '2026-01-12T00:00:00.000Z',
  },
];

// ─── Tasks ────────────────────────────────────────────────────────────────────

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const nextWeek = new Date(Date.now() + 7 * 86400000)
  .toISOString()
  .split('T')[0];

export const mockTasks: Task[] = [
  // Critical (urgent + important)
  {
    id: 'task-1',
    title: 'Finaliser la page de connexion',
    description: 'Intégrer le formulaire avec validation et appel API.',
    quadrant: 'critical',
    folderId: 'folder-3',
    userId: 'user-1',
    dueDate: today,
    isDone: false,
    deletedAt: null,
    createdAt: '2026-04-20T10:00:00.000Z',
    updatedAt: '2026-04-20T10:00:00.000Z',
  },
  {
    id: 'task-2',
    title: 'Préparer la réunion client',
    description: null,
    quadrant: 'critical',
    folderId: 'folder-2',
    userId: 'user-1',
    dueDate: yesterday,
    isDone: false,
    deletedAt: null,
    createdAt: '2026-04-19T09:00:00.000Z',
    updatedAt: '2026-04-19T09:00:00.000Z',
  },
  // Schedule (important, not urgent)
  {
    id: 'task-3',
    title: 'Mettre en place les tests unitaires',
    description: 'Couvrir les composants Auth avec Vitest.',
    quadrant: 'schedule',
    folderId: 'folder-3',
    userId: 'user-1',
    dueDate: nextWeek,
    isDone: false,
    deletedAt: null,
    createdAt: '2026-04-18T08:00:00.000Z',
    updatedAt: '2026-04-18T08:00:00.000Z',
  },
  {
    id: 'task-4',
    title: 'Rédiger la documentation technique',
    description: null,
    quadrant: 'schedule',
    folderId: 'folder-3',
    userId: 'user-1',
    dueDate: nextWeek,
    isDone: false,
    deletedAt: null,
    createdAt: '2026-04-17T08:00:00.000Z',
    updatedAt: '2026-04-17T08:00:00.000Z',
  },
  // Delegate (urgent, not important)
  {
    id: 'task-5',
    title: 'Répondre aux emails en attente',
    description: null,
    quadrant: 'delegate',
    folderId: null,
    userId: 'user-1',
    dueDate: today,
    isDone: false,
    deletedAt: null,
    createdAt: '2026-04-22T07:00:00.000Z',
    updatedAt: '2026-04-22T07:00:00.000Z',
  },
  // Secondary (not urgent, not important)
  {
    id: 'task-6',
    title: 'Trier les favoris du navigateur',
    description: null,
    quadrant: 'secondary',
    folderId: 'folder-1',
    userId: 'user-1',
    dueDate: null,
    isDone: false,
    deletedAt: null,
    createdAt: '2026-04-15T12:00:00.000Z',
    updatedAt: '2026-04-15T12:00:00.000Z',
  },
  // Done
  {
    id: 'task-7',
    title: 'Setup CI/CD GitHub Actions',
    description: 'Configuration des workflows CI et release.',
    quadrant: 'critical',
    folderId: 'folder-3',
    userId: 'user-1',
    dueDate: '2026-04-24T00:00:00.000Z',
    isDone: true,
    deletedAt: null,
    createdAt: '2026-04-10T10:00:00.000Z',
    updatedAt: '2026-04-24T18:00:00.000Z',
  },
  {
    id: 'task-8',
    title: 'Configurer ESLint et Prettier',
    description: null,
    quadrant: 'schedule',
    folderId: 'folder-3',
    userId: 'user-1',
    dueDate: null,
    isDone: true,
    deletedAt: null,
    createdAt: '2026-04-05T10:00:00.000Z',
    updatedAt: '2026-04-08T10:00:00.000Z',
  },
  // Trashed
  {
    id: 'task-9',
    title: 'Ancienne tâche supprimée',
    description: null,
    quadrant: 'secondary',
    folderId: null,
    userId: 'user-1',
    dueDate: null,
    isDone: false,
    deletedAt: '2026-04-20T10:00:00.000Z',
    createdAt: '2026-04-01T10:00:00.000Z',
    updatedAt: '2026-04-20T10:00:00.000Z',
  },
];

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

// ─── Auth token ────────────────────────────────────────────────────────────────

export const MOCK_TOKEN = 'mock-jwt-token-priozen-dev';
