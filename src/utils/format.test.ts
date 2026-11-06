import { describe, expect, it } from 'vitest';
import { formatLongDate, getInitials } from './format';

describe('formatLongDate', () => {
  const date = new Date(2026, 9, 18);

  it('formats a capitalized long date in French', (): void => {
    expect(formatLongDate(date, 'fr')).toBe('Dimanche 18 octobre 2026');
  });

  it('formats a long date in English', (): void => {
    expect(formatLongDate(date, 'en')).toBe('Sunday, October 18, 2026');
  });
});

describe('getInitials', () => {
  it('returns the uppercase initials of first and last name', (): void => {
    expect(getInitials({ firstName: 'martin', lastName: 'Dupont' })).toBe('MD');
  });
});
