import { describe, expect, it } from 'vitest';
import { isValidEmail } from './validation';

describe('isValidEmail', () => {
  it.each([
    'martin@priozen.app',
    'john.smith+tag@sub.example.co',
    '  a@b.fr  ',
  ])('accepts %s', (value: string): void => {
    expect(isValidEmail(value)).toBe(true);
  });

  it.each([
    '',
    'martin',
    'martin@',
    '@priozen.app',
    'martin@priozen',
    'a b@c.fr',
  ])('rejects "%s"', (value: string): void => {
    expect(isValidEmail(value)).toBe(false);
  });
});
