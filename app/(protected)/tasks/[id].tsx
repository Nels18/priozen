import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text } from 'react-native';
import { TaskForm } from '@/src/components/tasks/TaskForm';
import { TaskModal } from '@/src/components/tasks/TaskModal';
import { folderQueries } from '@/src/folders/folderQueries';
import { useCloseModal } from '@/src/navigation/useCloseModal';
import { taskToFormValues } from '@/src/tasks/taskForm';
import { taskMutations } from '@/src/tasks/taskMutations';
import { taskQueries } from '@/src/tasks/taskQueries';
import type { Task } from '@/src/types/models';

/** /tasks/:id — the same modal in edit mode, every field prefilled. */
export default function EditTaskScreen(): JSX.Element {
  const { t, i18n } = useTranslation('tasks');
  const { id } = useLocalSearchParams<{ id: string }>();
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

  return (
    <TaskModal title={t('form.editTitle')} onClose={close}>
      {task.isPending && (
        <ActivityIndicator
          accessibilityLabel={t('form.loading')}
          className="py-10"
        />
      )}
      {(task.isError || (task.isSuccess && task.data === null)) && (
        <Text className="pb-10 pt-4 font-sans text-sm text-muted">
          {t('form.notFound')}
        </Text>
      )}
      {task.data && (
        <TaskForm
          // Prefilled once: a background refetch must not reset the typing.
          key={task.data.id}
          initialValues={taskToFormValues(task.data, i18n.language)}
          folders={folders.data ?? []}
          submitLabel={t('form.save')}
          onCancel={close}
          onSubmit={async (input) => {
            await update.mutateAsync({ id, changes: input });
            close();
          }}
        />
      )}
    </TaskModal>
  );
}
