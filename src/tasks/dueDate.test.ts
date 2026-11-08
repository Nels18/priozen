import { describe, expect, it } from 'vitest';
import { getStartOfDay } from '../utils/startOfToday';
import { getDueDateDisplay, getDueDateInfo } from './dueDate';

// 18 Oct 2026, local time.
const TODAY = getStartOfDay(new Date(2026, 9, 18, 15, 0));

describe('getDueDateInfo', () => {
  it('is overdue for any day before today, even late in the evening', (): void => {
    expect(
      getDueDateInfo(new Date(2026, 9, 17, 23, 59).toISOString(), TODAY),
    ).toEqual({ status: 'overdue', days: -1 });
    expect(getDueDateInfo(new Date(2026, 9, 11).toISOString(), TODAY)).toEqual({
      status: 'overdue',
      days: -7,
    });
  });

  it('is due today whatever the hour', (): void => {
    expect(
      getDueDateInfo(new Date(2026, 9, 18, 0, 0).toISOString(), TODAY),
    ).toEqual({ status: 'today', days: 0 });
    expect(
      getDueDateInfo(new Date(2026, 9, 18, 23, 59).toISOString(), TODAY),
    ).toEqual({ status: 'today', days: 0 });
  });

  it('counts the days left for an upcoming date', (): void => {
    expect(
      getDueDateInfo(new Date(2026, 9, 19, 8, 0).toISOString(), TODAY),
    ).toEqual({ status: 'upcoming', days: 1 });
    // Crosses the end of daylight saving time (25 Oct 2026 in Europe).
    expect(getDueDateInfo(new Date(2026, 9, 28).toISOString(), TODAY)).toEqual({
      status: 'upcoming',
      days: 10,
    });
  });
});

describe('getDueDateDisplay', () => {
  const at = (day: number): string => new Date(2026, 9, day, 10).toISOString();

  it.each([
    {
      due: at(15),
      isDone: false,
      tone: 'overdue',
      labelKey: 'dueDate.overdue',
    },
    { due: at(18), isDone: false, tone: 'today', labelKey: 'dueDate.today' },
    {
      due: at(19),
      isDone: false,
      tone: 'upcoming',
      labelKey: 'dueDate.tomorrow',
    },
    { due: at(25), isDone: false, tone: 'upcoming', labelKey: null },
    // A done task is never late, and always neutral.
    { due: at(15), isDone: true, tone: 'upcoming', labelKey: null },
    { due: at(18), isDone: true, tone: 'upcoming', labelKey: 'dueDate.today' },
  ])(
    'due $due, done=$isDone → $tone / $labelKey',
    ({ due, isDone, tone, labelKey }): void => {
      expect(getDueDateDisplay(due, TODAY, isDone)).toEqual({ tone, labelKey });
    },
  );
});
