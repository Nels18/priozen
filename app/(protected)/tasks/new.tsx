import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { TaskForm } from '@/src/components/tasks/TaskForm';
import { TaskModal } from '@/src/components/tasks/TaskModal';
import { folderQueries } from '@/src/folders/folderQueries';
import { useCloseModal } from '@/src/navigation/useCloseModal';
import { EMPTY_TASK_FORM } from '@/src/tasks/taskForm';
import { taskMutations } from '@/src/tasks/taskMutations';

/** /tasks/new — "Nouvelle tâche" modal, above the current screen. */
export default function NewTaskScreen(): JSX.Element {
  const { t } = useTranslation('tasks');
  const close = useCloseModal();
  const queryClient = useQueryClient();
  const create = useMutation(taskMutations.create(queryClient));
  const folders = useQuery(folderQueries.list());

  return (
    <TaskModal title={t('form.newTitle')} onClose={close}>
      <TaskForm
        initialValues={EMPTY_TASK_FORM}
        folders={folders.data ?? []}
        submitLabel={t('form.create')}
        onCancel={close}
        onSubmit={async (input) => {
          await create.mutateAsync(input);
          close();
        }}
      />
    </TaskModal>
  );
}
