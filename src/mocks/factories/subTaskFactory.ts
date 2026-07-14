import { fakerFR as faker } from '@faker-js/faker';
import type { SubTask } from '../data/fixtures';
import { createId, randomBool } from '../utils';

// Deterministic — stable values for unit tests.
export const makeDumbSubTask = (overrides: Partial<SubTask> = {}): SubTask => ({
  id: 'subtask-1',
  taskId: 'task-1',
  title: 'Intégration maquette Figma',
  isDone: false,
  ...overrides,
});

// Randomized — realistic seed data, not for test assertions.
export const makeSubTask = (
  taskId: string,
  overrides: Partial<SubTask> = {},
): SubTask => ({
  id: createId('subtask'),
  taskId,
  title: faker.hacker.phrase(),
  isDone: randomBool(0.4),
  ...overrides,
});

export const makeSubTasks = (taskId: string, count: number): SubTask[] =>
  Array.from({ length: count }, () => makeSubTask(taskId));
