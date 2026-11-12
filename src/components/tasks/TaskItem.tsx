import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { editTaskRoute } from '@/src/navigation/routes';
import { QUADRANT_CLASSES } from '@/src/tasks/quadrants';
import fixedColors from '@/src/theme/fixedColors';
import type { Folder, Task } from '@/src/types/models';
import { DueDateChip } from './DueDateChip';

interface TaskItemProps {
  task: Task;
  folder: Folder | undefined;
  startOfToday: number;
  /** Shows the quadrant badge (in the "done" group, which mixes quadrants). */
  isQuadrantShown: boolean;
  isLast: boolean;
  onToggleDone: (task: Task) => void;
}

/**
 * One task row: checkbox, title, folder, due date (and quadrant badge).
 * The checkbox ticks the task; the rest of the row opens it for editing.
 */
export function TaskItem({
  task,
  folder,
  startOfToday,
  isQuadrantShown,
  isLast,
  onToggleDone,
}: TaskItemProps): JSX.Element {
  const { t } = useTranslation('tasks');
  const hasMeta = folder !== undefined || task.dueDate !== null;

  return (
    <View
      className={`flex-row items-start gap-3 py-3.5 ${
        isLast ? '' : 'border-b border-border'
      }`}
    >
      <Pressable
        accessibilityRole="checkbox"
        // aria-*, not accessibilityState: see .github/review-guidelines.md.
        aria-checked={task.isDone}
        accessibilityLabel={task.title}
        hitSlop={12}
        onPress={() => onToggleDone(task)}
        className={`mt-0.5 h-5 w-5 items-center justify-center rounded-full border-2 ${
          task.isDone ? 'border-success bg-success' : 'border-border'
        }`}
      >
        {task.isDone && (
          <Ionicons
            name="checkmark"
            aria-hidden
            size={12}
            color={fixedColors.white}
          />
        )}
      </Pressable>

      <Link href={editTaskRoute(task.id)} asChild>
        <Pressable
          accessibilityHint={t('editHint')}
          className="min-w-0 flex-1 rounded-sm active:opacity-70"
        >
          <Text
            className={`font-sans-medium text-sm leading-5 ${
              task.isDone ? 'text-muted line-through' : 'text-text'
            }`}
          >
            {task.title}
          </Text>

          {(hasMeta || isQuadrantShown) && (
            <View className="mt-1 flex-row flex-wrap items-center gap-2">
              {isQuadrantShown && (
                <Text
                  className={`overflow-hidden rounded-full px-2 py-0.5 font-sans-semibold text-tiny ${
                    QUADRANT_CLASSES[task.quadrant].badge
                  }`}
                >
                  {t(`quadrants.${task.quadrant}`)}
                </Text>
              )}
              {folder && (
                <View className="flex-row items-center gap-1">
                  <View
                    className="h-2 w-2 rounded-full"
                    // Folder colors are user data, not theme tokens.
                    style={{ backgroundColor: folder.color }}
                  />
                  <Text className="font-sans text-tiny text-muted">
                    {folder.name}
                  </Text>
                </View>
              )}
              {task.dueDate && (
                <DueDateChip
                  dueDate={task.dueDate}
                  startOfToday={startOfToday}
                  isDone={task.isDone}
                />
              )}
            </View>
          )}
        </Pressable>
      </Link>
    </View>
  );
}
