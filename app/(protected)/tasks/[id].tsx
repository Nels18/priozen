import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, View } from 'react-native';
import { TaskForm } from '@/src/components/tasks/TaskForm';
import { TaskModal } from '@/src/components/tasks/TaskModal';
import { Button } from '@/src/components/ui/Button';
import { folderQueries } from '@/src/folders/folderQueries';
import { useCloseModal } from '@/src/navigation/useCloseModal';
import { taskToFormValues } from '@/src/tasks/taskForm';
import { taskMutations } from '@/src/tasks/taskMutations';
import { taskQueries } from '@/src/tasks/taskQueries';
import type { Task } from '@/src/types/models';

/** /tasks/:id — the same modal in edit mode, every field prefilled. */
export default function EditTaskScreen(): JSX.Element {
  const { t, i18n } = useTranslation('tasks');
  // The id comes from the URL: a repeated parameter gives an array.
  const param = useLocalSearchParams<{ id?: string | string[] }>().id;
  const id = typeof param === 'string' ? param : null;
  const close = useCloseModal();
  const queryClient = useQueryClient();
  const update = useMutation(taskMutations.update(queryClient));
  const folders = useQuery(folderQueries.list());
  // Read from the shared task list: usually already in the cache.
  const task = useQuery({
    ...taskQueries.list(),
    select: (tasks: Task[]): Task | null =>
      tasks.find((candidate) => candidate.id === id) ?? null,
  });
  const editedTask = task.data;

  return (
    <TaskModal title={t('form.editTitle')} onClose={close}>
      {task.isPending && (
        <ActivityIndicator
          accessibilityLabel={t('form.loading')}
          className="py-10"
        />
      )}

      {/* The list couldn't load (and nothing is cached): the task may well
          exist, so offer a retry rather than "not found". */}
      {task.isError && !editedTask && (
        <View className="items-start gap-4 pb-10 pt-4">
          <Text
            accessibilityRole="alert"
            className="font-sans text-sm text-critical"
          >
            {t('form.loadFailed')}
          </Text>
          <Button
            label={t('form.retry')}
            onPress={() => void task.refetch()}
            isLoading={task.isFetching}
          />
        </View>
      )}

      {task.isSuccess && task.data === null && (
        <Text className="pb-10 pt-4 font-sans text-sm text-muted">
          {t('form.notFound')}
        </Text>
      )}

      {editedTask && (
        <TaskForm
          // Prefilled once: a background refetch must not reset the typing.
          key={editedTask.id}
          initialValues={taskToFormValues(editedTask, i18n.language)}
          folders={folders.data ?? []}
          submitLabel={t('form.save')}
          onCancel={close}
          onSubmit={async (input) => {
            await update.mutateAsync({ id: editedTask.id, changes: input });
            close();
          }}
        />
      )}
    </TaskModal>
  );
}
