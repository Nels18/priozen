import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';
import type { DueDateStatus } from '@/src/tasks/dueDate';
import { getDueDateDisplay } from '@/src/tasks/dueDate';
import { formatShortDate } from '@/src/utils/format';

const TONE_CLASSES: Record<DueDateStatus, string> = {
  overdue: 'bg-critical-bg text-critical',
  today: 'bg-schedule-bg text-primary',
  upcoming: 'bg-secondary-bg text-muted',
};

interface DueDateChipProps {
  dueDate: string;
  startOfToday: number;
  /** A done task is never late: its date is shown neutral. */
  isDone: boolean;
}

/** Pill with the due date: red when overdue, indigo today, grey later. */
export function DueDateChip({
  dueDate,
  startOfToday,
  isDone,
}: DueDateChipProps): JSX.Element {
  const { t, i18n } = useTranslation('tasks');
  const { tone, labelKey } = getDueDateDisplay(dueDate, startOfToday, isDone);
  const label = labelKey
    ? t(labelKey)
    : formatShortDate(new Date(dueDate), i18n.language);

  return (
    <Text
      className={`overflow-hidden rounded-full px-2 py-0.5 font-sans-medium text-tiny ${
        TONE_CLASSES[tone]
      }`}
    >
      {label}
    </Text>
  );
}
