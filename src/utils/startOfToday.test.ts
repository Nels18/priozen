import { describe, expect, it } from 'vitest';
import { getMsUntilNextDay, getStartOfDay } from './startOfToday';

describe('getStartOfDay', () => {
  it('returns local midnight of the same day', (): void => {
    expect(getStartOfDay(new Date(2026, 10, 7, 18, 45))).toBe(
      new Date(2026, 10, 7).getTime(),
    );
  });
});

describe('getMsUntilNextDay', () => {
  it('counts down to the next local midnight', (): void => {
    expect(getMsUntilNextDay(new Date(2026, 10, 7, 23, 0))).toBe(
      60 * 60 * 1000,
    );
  });

  it('is a full day at midnight itself', (): void => {
    expect(getMsUntilNextDay(new Date(2026, 10, 7))).toBe(24 * 60 * 60 * 1000);
  });
});
