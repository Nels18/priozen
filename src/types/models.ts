// Domain models = the API contract (camelCase JSON). Shared by the app, the
// API client and the MSW mocks — so removing the mocks never breaks the app.
// To be confirmed against the real backend (see CLAUDE.md).

/** Eisenhower quadrants, in priority order (most urgent/important first). */
export const EISENHOWER_QUADRANTS = [
  'critical', // urgent + important
  'schedule', // important, not urgent
  'delegate', // urgent, not important
  'secondary', // neither
] as const;

export type EisenhowerQuadrant = (typeof EISENHOWER_QUADRANTS)[number];

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
  color: string; // hex
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
  deletedAt: string | null; // soft delete (trash)
  createdAt: string;
  updatedAt: string;
}

export interface SubTask {
  id: string;
  taskId: string;
  title: string;
  isDone: boolean;
}
