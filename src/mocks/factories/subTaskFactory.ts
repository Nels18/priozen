import { fakerFR as faker } from '@faker-js/faker';
import type { SubTask } from '../../types/models';
import { createId, randomBool } from '../utils';

const SUBTASK_TITLES = [
  'Rédiger le brouillon',
  'Relire et corriger',
  'Valider avec l’équipe',
  'Envoyer pour approbation',
  'Mettre à jour le suivi',
  'Vérifier les délais',
  'Préparer les pièces jointes',
  'Faire le point avec le client',
];

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
  title: faker.helpers.arrayElement(SUBTASK_TITLES),
  isDone: randomBool(0.4),
  ...overrides,
});

export const makeSubTasks = (taskId: string, count: number): SubTask[] =>
  Array.from({ length: count }, () => makeSubTask(taskId));
