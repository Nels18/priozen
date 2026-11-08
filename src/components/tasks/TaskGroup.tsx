import type { JSX } from 'react';
import { Text, View } from 'react-native';
import type { Folder, Task } from '@/src/types/models';
import { TaskItem } from './TaskItem';

interface TaskGroupProps {
  title: string;
  /** Short explanation next to the title ("Important et urgent"). */
  hint?: string;
  dotClassName: string;
  titleClassName: string;
  tasks: Task[];
  emptyLabel: string;
  foldersById: ReadonlyMap<string, Folder>;
  startOfToday: number;
  isQuadrantShown?: boolean;
  onToggleDone: (task: Task) => void;
  className?: string;
}

/** Card listing one group of tasks: colored header, counter, rows. */
export function TaskGroup({
  title,
  hint,
  dotClassName,
  titleClassName,
  tasks,
  emptyLabel,
  foldersById,
  startOfToday,
  isQuadrantShown = false,
  onToggleDone,
  className = '',
}: TaskGroupProps): JSX.Element {
  return (
    <View
      className={`rounded-md border border-border bg-card p-4 shadow-sm ${className}`}
    >
      <View className="mb-3 flex-row items-center justify-between gap-2">
        <View className="min-w-0 flex-1 flex-row flex-wrap items-center gap-x-2">
          <View className={`h-2 w-2 rounded-full ${dotClassName}`} />
          <Text
            accessibilityRole="header"
            className={`font-sans-bold text-caption uppercase tracking-wide ${titleClassName}`}
          >
            {title}
          </Text>
          {hint && (
            <Text className="font-sans text-tiny text-muted">{hint}</Text>
          )}
        </View>
        <Text className="overflow-hidden rounded-full bg-input px-2 py-0.5 font-sans-semibold text-xs text-muted">
          {tasks.length}
        </Text>
      </View>

      {tasks.length === 0 ? (
        <Text className="py-3 font-sans text-caption text-muted">
          {emptyLabel}
        </Text>
      ) : (
        tasks.map((task, index) => (
          <TaskItem
            key={task.id}
            task={task}
            folder={
              task.folderId === null
                ? undefined
                : foldersById.get(task.folderId)
            }
            startOfToday={startOfToday}
            isQuadrantShown={isQuadrantShown}
            isLast={index === tasks.length - 1}
            onToggleDone={onToggleDone}
          />
        ))
      )}
    </View>
  );
}
