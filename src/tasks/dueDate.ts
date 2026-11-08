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

export interface DueDateDisplay {
  /** Color of the chip. */
  tone: DueDateStatus;
  /** Translation key ("tasks" namespace), or null to show the date itself. */
  labelKey: 'dueDate.overdue' | 'dueDate.today' | 'dueDate.tomorrow' | null;
}

/**
 * How a task's due date is shown. A done task is never late: its chip is
 * neutral and shows the date instead of "overdue".
 */
export const getDueDateDisplay = (
  dueDate: string,
  startOfToday: number,
  isDone: boolean,
): DueDateDisplay => {
  const { status, days } = getDueDateInfo(dueDate, startOfToday);
  const tone = isDone ? 'upcoming' : status;

  if (status === 'overdue') {
    return { tone, labelKey: isDone ? null : 'dueDate.overdue' };
  }
  if (status === 'today') return { tone, labelKey: 'dueDate.today' };
  if (days === 1) return { tone, labelKey: 'dueDate.tomorrow' };
  return { tone, labelKey: null };
};
