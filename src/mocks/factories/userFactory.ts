import { fakerFR as faker } from '@faker-js/faker';
import type { User } from '../data/fixtures';
import { createId } from '../utils';

// Deterministic — stable values for unit tests.
export const makeDumbUser = (overrides: Partial<User> = {}): User => ({
  id: 'user-1',
  firstName: 'Nelson',
  lastName: 'Belgarde',
  email: 'nelson@priozen.app',
  createdAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

// Randomized — realistic seed data, not for test assertions.
export const makeUser = (overrides: Partial<User> = {}): User => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    id: createId('user'),
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    createdAt: faker.date.past({ years: 1 }).toISOString(),
    ...overrides,
  };
};
