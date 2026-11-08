import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, View } from 'react-native';
import { useAuth } from '@/src/auth/AuthProvider';
import { Screen } from '@/src/components/layout/Screen';
import { DashboardSummary } from '@/src/components/tasks/DashboardSummary';
import { TaskGroup } from '@/src/components/tasks/TaskGroup';
import { Button } from '@/src/components/ui/Button';
import { folderQueries } from '@/src/folders/folderQueries';
import { useScreenSize } from '@/src/layout/screenSize';
import type { GroupedTasks } from '@/src/tasks/grouping';
import { groupTasks } from '@/src/tasks/grouping';
import type { EisenhowerQuadrant, Folder, Task } from '@/src/types/models';
import { EISENHOWER_QUADRANTS, QUADRANT_CLASSES } from '@/src/tasks/quadrants';
import { taskMutations } from '@/src/tasks/taskMutations';
import { taskQueries } from '@/src/tasks/taskQueries';
import { useTaskSummary } from '@/src/tasks/useTaskSummary';
import { useStartOfToday } from '@/src/utils/startOfToday';

// Large screens show the quadrants as the Eisenhower matrix: two rows of two.
const MATRIX_ROWS: EisenhowerQuadrant[][] = [
  EISENHOWER_QUADRANTS.slice(0, 2),
  EISENHOWER_QUADRANTS.slice(2, 4),
];

interface GroupsProps {
  grouped: GroupedTasks;
  foldersById: ReadonlyMap<string, Folder>;
  startOfToday: number;
  isMatrix: boolean;
  onToggleDone: (task: Task) => void;
}

function TaskGroups({
  grouped,
  foldersById,
  startOfToday,
  isMatrix,
  onToggleDone,
}: GroupsProps): JSX.Element {
  const { t } = useTranslation('tasks');

  const renderQuadrant = (
    quadrant: EisenhowerQuadrant,
    className: string,
  ): JSX.Element => (
    <TaskGroup
      key={quadrant}
      title={t(`quadrants.${quadrant}`)}
      hint={t(`quadrantHints.${quadrant}`)}
      dotClassName={QUADRANT_CLASSES[quadrant].dot}
      titleClassName={QUADRANT_CLASSES[quadrant].text}
      tasks={grouped.open[quadrant]}
      emptyLabel={t('emptyGroup')}
      foldersById={foldersById}
      startOfToday={startOfToday}
      onToggleDone={onToggleDone}
      className={className}
    />
  );

  return (
    <View className="gap-4">
      {isMatrix
        ? MATRIX_ROWS.map((row) => (
            <View key={row.join('-')} className="flex-row gap-4">
              {row.map((quadrant) => renderQuadrant(quadrant, 'flex-1'))}
            </View>
          ))
        : EISENHOWER_QUADRANTS.map((quadrant) => renderQuadrant(quadrant, ''))}

      <TaskGroup
        title={t('doneGroup')}
        dotClassName="bg-success"
        titleClassName="text-success"
        tasks={grouped.done}
        emptyLabel={t('emptyDoneGroup')}
        foldersById={foldersById}
        startOfToday={startOfToday}
        isQuadrantShown
        onToggleDone={onToggleDone}
      />
    </View>
  );
}

/** Tasks view: tasks grouped by Eisenhower quadrant, plus the done ones. */
export default function TasksScreen(): JSX.Element | null {
  const { t } = useTranslation('dashboard');
  const { session } = useAuth();
  const screenSize = useScreenSize();
  const startOfToday = useStartOfToday();
  const queryClient = useQueryClient();

  // Same cache entry as the right panel: ticking a task updates both.
  const tasks = useQuery({ ...taskQueries.list(), select: groupTasks });
  const summary = useTaskSummary();
  // Folder names are a bonus: the list still shows if they fail to load.
  const folders = useQuery(folderQueries.list());
  const setDone = useMutation(taskMutations.setDone(queryClient));

  // No useMemo / useCallback: the React Compiler (app.json) memoizes.
  const foldersById = new Map(
    (folders.data ?? []).map((folder) => [folder.id, folder]),
  );
  const handleToggleDone = (task: Task): void =>
    setDone.mutate({ id: task.id, isDone: !task.isDone });

  if (!session) return null;

  return (
    <Screen>
      <DashboardSummary
        firstName={session.user.firstName}
        summary={summary.data}
        isCompact={screenSize === 'small'}
      />

      {tasks.isPending && <ActivityIndicator className="mt-8" />}

      {tasks.isError && (
        <View className="items-center gap-4 rounded-md border border-border bg-card px-6 py-10">
          <Text className="text-center font-sans text-sm text-critical">
            {t('loadError')}
          </Text>
          <Button
            label={t('retry')}
            onPress={() => void tasks.refetch()}
            isLoading={tasks.isFetching}
            className="px-6"
          />
        </View>
      )}

      {tasks.isSuccess && (
        <TaskGroups
          grouped={tasks.data}
          foldersById={foldersById}
          startOfToday={startOfToday}
          isMatrix={screenSize === 'large'}
          onToggleDone={handleToggleDone}
        />
      )}
    </Screen>
  );
}
