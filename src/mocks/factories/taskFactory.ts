import { fakerFR as faker } from '@faker-js/faker';
import type { EisenhowerQuadrant, Folder, Task } from '../data/fixtures';
import { createId, randomBool } from '../utils';

const QUADRANTS: EisenhowerQuadrant[] = [
  'critical',
  'schedule',
  'delegate',
  'secondary',
];

const TASK_TITLES = [
  'Préparer la présentation client',
  'Relancer le fournisseur pour la facture',
  'Mettre à jour le tableau de bord mensuel',
  'Organiser la réunion d’équipe',
  'Trier la boîte mail',
  'Réviser le plan de sprint',
  'Rédiger le compte-rendu de réunion',
  'Planifier les congés de l’équipe',
  'Faire le point sur le budget trimestriel',
  'Contacter le support technique',
  'Nettoyer le bureau',
  'Renouveler l’abonnement logiciel',
  'Préparer la checklist de déploiement',
  'Répondre aux commentaires de code',
  'Mettre à jour la documentation utilisateur',
  'Faire les courses pour la semaine',
  'Prendre rendez-vous chez le dentiste',
  'Réserver les billets de train',
  'Payer les factures du mois',
  'Ranger le garage',
];

// Deterministic — stable values for unit tests.
export const makeDumbTask = (overrides: Partial<Task> = {}): Task => ({
  id: 'task-1',
  title: 'Finaliser la page de connexion',
  description: null,
  quadrant: 'schedule',
  folderId: null,
  userId: 'user-1',
  dueDate: null,
  isDone: false,
  deletedAt: null,
  createdAt: '2026-04-20T10:00:00.000Z',
  updatedAt: '2026-04-20T10:00:00.000Z',
  ...overrides,
});

// Randomized — realistic seed data, not for test assertions.
export const makeTask = (overrides: Partial<Task> = {}): Task => {
  const createdAt = faker.date.past({ years: 1 }).toISOString();

  return {
    id: createId('task'),
    title: faker.helpers.arrayElement(TASK_TITLES),
    description: randomBool(0.5) ? faker.lorem.sentence() : null,
    quadrant: faker.helpers.arrayElement(QUADRANTS),
    folderId: null,
    userId: 'user-1',
    dueDate: randomBool(0.6)
      ? faker.date.soon({ days: 14 }).toISOString()
      : null,
    isDone: randomBool(0.3),
    deletedAt: null,
    createdAt,
    updatedAt: createdAt,
    ...overrides,
  };
};

export const makeTasks = (count: number, folders: Folder[] = []): Task[] =>
  Array.from({ length: count }, () =>
    makeTask({
      folderId:
        folders.length > 0 && randomBool(0.6)
          ? faker.helpers.arrayElement(folders).id
          : null,
    }),
  );
