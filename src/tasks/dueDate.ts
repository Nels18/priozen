import { getStartOfDay } from '../utils/startOfToday';

export type DueDateStatus = 'overdue' | 'today' | 'upcoming';

export interface DueDateInfo {
  status: DueDateStatus;
  /** Whole days from today to the due date (negative when overdue). */
  days: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Where a due date stands relative to today, by calendar day (local time):
 * anything before today is overdue, whatever the hour.
 */
export const getDueDateInfo = (
  dueDate: string,
  startOfToday: number,
): DueDateInfo => {
  // Math.round absorbs the 23h/25h days around daylight saving changes.
  const days = Math.round(
    (getStartOfDay(new Date(dueDate)) - startOfToday) / DAY_MS,
  );
  if (days < 0) return { status: 'overdue', days };
  if (days === 0) return { status: 'today', days };
  return { status: 'upcoming', days };
};
