import { fakerFR as faker } from '@faker-js/faker';
import type { Folder } from '../data/fixtures';
import { createId } from '../utils';

const FOLDER_COLORS = ['#6366F1', '#F59E0B', '#10B981', '#EF4444', '#0EA5E9'];

// Deterministic — stable values for unit tests.
export const makeDumbFolder = (overrides: Partial<Folder> = {}): Folder => ({
  id: 'folder-1',
  name: 'Perso',
  color: '#6366F1',
  userId: 'user-1',
  taskCount: 0,
  createdAt: '2026-01-10T00:00:00.000Z',
  ...overrides,
});

// Randomized — realistic seed data, not for test assertions.
export const makeFolder = (overrides: Partial<Folder> = {}): Folder => ({
  id: createId('folder'),
  name: faker.word.words({ count: { min: 1, max: 2 } }),
  color: faker.helpers.arrayElement(FOLDER_COLORS),
  userId: 'user-1',
  taskCount: faker.number.int({ min: 0, max: 12 }),
  createdAt: faker.date.past({ years: 1 }).toISOString(),
  ...overrides,
});

export const makeFolders = (count: number): Folder[] =>
  Array.from({ length: count }, () => makeFolder());
