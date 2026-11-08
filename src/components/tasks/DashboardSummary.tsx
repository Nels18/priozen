import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import type { TaskSummary } from '@/src/tasks/summary';

interface DashboardSummaryProps {
  firstName: string;
  summary: TaskSummary | undefined;
  /** Small screens: greeting above a compact progress card. */
  isCompact: boolean;
}

function ProgressBar({
  done,
  total,
}: {
  done: number;
  total: number;
}): JSX.Element {
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: total, now: done }}
      className="mt-2 h-1.5 overflow-hidden rounded-full bg-input"
    >
      <View
        style={{ width: `${percent}%` }}
        className="h-full rounded-full bg-primary"
      />
    </View>
  );
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
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  if (isCompact) {
    return (
      <View className="mb-5">
        <Text className="font-sans text-caption text-muted">
          {t('greeting')}
        </Text>
        <Text className="mt-0.5 font-serif text-[26px] text-text">
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
          <ProgressBar done={done} total={total} />
        </View>
      </View>
    );
  }

  return (
    <View className="mb-5 rounded-md border border-border bg-card p-[18px] shadow-sm">
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
          <Text className="font-sans-bold text-[28px] tracking-tighter text-text">
            {percent}%
          </Text>
          <Text className="font-sans text-xs text-muted">
            {t('completedPercent')}
          </Text>
        </View>
      </View>
      <ProgressBar done={done} total={total} />
    </View>
  );
}
