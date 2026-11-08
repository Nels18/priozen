import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import type { TaskSummary } from '@/src/tasks/summary';
import { getCompletionPercent } from '@/src/tasks/summary';
import { ProgressBar } from '../ui/ProgressBar';

interface DashboardSummaryProps {
  firstName: string;
  summary: TaskSummary | undefined;
  /** Small screens: greeting above a compact progress card. */
  isCompact: boolean;
}

/** Stats strip at the top of the dashboard: greeting and progress. */
export function DashboardSummary({
  firstName,
  summary,
  isCompact,
}: DashboardSummaryProps): JSX.Element {
  const { t } = useTranslation('dashboard');
  const done = summary?.doneCount ?? 0;
  const total = summary?.totalCount ?? 0;
  const percent = getCompletionPercent({ doneCount: done, totalCount: total });
  const progressBar = (
    <ProgressBar
      label={t('completedTasks')}
      value={done}
      max={total}
      percent={percent}
      className="mt-2"
    />
  );

  if (isCompact) {
    return (
      <View className="mb-5">
        <Text className="font-sans text-caption text-muted">
          {t('greeting')}
        </Text>
        <Text className="mt-0.5 font-serif text-greeting text-text">
          {t('greetingName', { firstName })}
        </Text>
        <View className="mt-3 rounded-md border border-border bg-card p-3.5 shadow-sm">
          <View className="flex-row justify-between">
            <Text className="font-sans text-caption text-muted">
              {t('completedTasks')}
            </Text>
            <Text className="font-sans-bold text-caption text-text">
              {done}/{total}
            </Text>
          </View>
          {progressBar}
        </View>
      </View>
    );
  }

  return (
    <View className="mb-5 rounded-md border border-border bg-card p-4 shadow-sm">
      <View className="mb-3 flex-row items-center justify-between gap-4">
        <View className="flex-1">
          <Text className="font-serif text-xl text-text">
            {t('greetingInline', { firstName })}
          </Text>
          <Text className="mt-0.5 font-sans text-caption text-muted">
            {t('todaySubtitle')}
          </Text>
        </View>
        <View className="items-end">
          <Text className="font-sans-bold text-stat tracking-tighter text-text">
            {percent}%
          </Text>
          <Text className="font-sans text-xs text-muted">
            {t('completedPercent')}
          </Text>
        </View>
      </View>
      {progressBar}
    </View>
  );
}
