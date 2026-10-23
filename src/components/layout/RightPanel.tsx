import type { JSX, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import type { TaskSummary } from '@/src/tasks/summary';
import { EISENHOWER_QUADRANTS, QUADRANT_CLASSES } from '@/src/tasks/quadrants';
import { useTaskSummary } from '@/src/tasks/useTaskSummary';

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <View className="mb-6">
      <Text
        accessibilityRole="header"
        className="mb-4 font-sans-bold text-sm text-text"
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

function SummaryContent({ summary }: { summary: TaskSummary }): JSX.Element {
  const { t } = useTranslation(['layout', 'tasks']);
  const progress =
    summary.totalCount === 0 ? 0 : summary.doneCount / summary.totalCount;

  return (
    <>
      <Section title={t('rightPanel.overview')}>
        {EISENHOWER_QUADRANTS.map((quadrant, index) => (
          <View
            key={quadrant}
            className={`flex-row items-center justify-between py-2.5 ${
              index < EISENHOWER_QUADRANTS.length - 1
                ? 'border-b border-border'
                : ''
            }`}
          >
            <View className="flex-row items-center gap-2">
              <View
                className={`h-2 w-2 rounded-full ${QUADRANT_CLASSES[quadrant].dot}`}
              />
              <Text className="font-sans text-caption text-muted">
                {t(`tasks:quadrants.${quadrant}`)}
              </Text>
            </View>
            <Text className="font-sans-bold text-sm text-text">
              {summary.openByQuadrant[quadrant]}
            </Text>
          </View>
        ))}
      </Section>

      <Section title={t('rightPanel.progress')}>
        <View className="mb-1.5 flex-row justify-between">
          <Text className="font-sans text-caption text-muted">
            {t('rightPanel.completed')}
          </Text>
          <Text className="font-sans-semibold text-caption text-text">
            {summary.doneCount}/{summary.totalCount}
          </Text>
        </View>
        <View
          accessibilityRole="progressbar"
          accessibilityValue={{
            min: 0,
            max: summary.totalCount,
            now: summary.doneCount,
          }}
          className="h-1.5 overflow-hidden rounded-full bg-input"
        >
          <View
            style={{ width: `${Math.round(progress * 100)}%` }}
            className="h-full rounded-full bg-primary"
          />
        </View>
      </Section>

      <Section title={t('rightPanel.overdue')}>
        {summary.overdue.length === 0 ? (
          <Text className="font-sans text-caption text-muted">
            {t('rightPanel.noOverdue')}
          </Text>
        ) : (
          summary.overdue.map((task) => (
            <View
              key={task.id}
              className="mb-2 flex-row items-start gap-2 rounded-sm bg-critical-bg px-3 py-2.5"
            >
              <Text className="font-sans text-xs text-critical">⚠</Text>
              <Text className="flex-1 font-sans-medium text-caption text-critical">
                {task.title}
              </Text>
            </View>
          ))
        )}
      </Section>
    </>
  );
}

/** 280px column summarizing the user's tasks (large screens only). */
export function RightPanel(): JSX.Element {
  const { t } = useTranslation('layout');
  const state = useTaskSummary();

  return (
    <ScrollView
      className="w-[280px] grow-0 border-l border-border bg-card"
      contentContainerClassName="px-5 py-6"
    >
      {state.status === 'loading' && <ActivityIndicator />}
      {state.status === 'error' && (
        <Text className="font-sans text-caption text-critical">
          {t('rightPanel.loadError')}
        </Text>
      )}
      {state.status === 'ready' && <SummaryContent summary={state.summary} />}
    </ScrollView>
  );
}
