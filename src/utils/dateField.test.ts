import { describe, expect, it } from 'vitest';
import {
  formatDateField,
  getDateFieldOrder,
  parseDateField,
} from './dateField';

describe('getDateFieldOrder', () => {
  it('puts the day first in French and the month first in English', (): void => {
    expect(getDateFieldOrder('fr')).toEqual(['day', 'month', 'year']);
    expect(getDateFieldOrder('en')).toEqual(['month', 'day', 'year']);
  });
});

describe('formatDateField', () => {
  it('formats with two-digit day and month', (): void => {
    const date = new Date(2026, 2, 5);
    expect(formatDateField(date, 'fr')).toBe('05/03/2026');
    expect(formatDateField(date, 'en')).toBe('03/05/2026');
  });
});

describe('parseDateField', () => {
  it('reads a date in the order of the language, at local midnight', (): void => {
    expect(parseDateField('05/03/2026', 'fr')).toEqual(new Date(2026, 2, 5));
    expect(parseDateField('03/05/2026', 'en')).toEqual(new Date(2026, 2, 5));
  });

  it('accepts other separators, spaces and one-digit parts', (): void => {
    expect(parseDateField(' 5-3-2026 ', 'fr')).toEqual(new Date(2026, 2, 5));
    expect(parseDateField('5.3.2026', 'fr')).toEqual(new Date(2026, 2, 5));
  });

  it.each([
    '31/02/2026',
    '12/13/2026',
    '00/01/2026',
    '1/1/26',
    '1/1',
    'demain',
    '',
  ])('rejects "%s" in French', (text): void => {
    expect(parseDateField(text, 'fr')).toBeNull();
  });

  it('round-trips with formatDateField', (): void => {
    const date = new Date(2026, 11, 31);
    expect(parseDateField(formatDateField(date, 'en'), 'en')).toEqual(date);
  });
});
