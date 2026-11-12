import type { TaskInput } from '../api/tasks';
import type { EisenhowerQuadrant, Task } from '../types/models';
import { formatDateField, parseDateField } from '../utils/dateField';

/** What the task form edits: text as typed, before validation. */
export interface TaskFormValues {
  title: string;
  description: string;
  quadrant: EisenhowerQuadrant;
  /** Typed date ("jj/mm/aaaa" in French), empty when none. */
  dueDate: string;
  folderId: string | null;
}

/** Translation keys ("tasks" namespace) of the form errors. */
export type TaskFormErrorKey =
  'form.errors.titleRequired' | 'form.errors.dueDateInvalid';

export type TaskFormErrors = Partial<
  Record<'title' | 'dueDate', TaskFormErrorKey>
>;

export type TaskFormResult =
  | { isValid: true; input: TaskInput }
  | { isValid: false; errors: TaskFormErrors };

/** New task: "À planifier" preselected (the quadrant most tasks belong in). */
export const EMPTY_TASK_FORM: TaskFormValues = {
  title: '',
  description: '',
  quadrant: 'schedule',
  dueDate: '',
  folderId: null,
};

/** Edit mode: every field prefilled from the task. */
export const taskToFormValues = (
  task: Task,
  language: string,
): TaskFormValues => ({
  title: task.title,
  description: task.description ?? '',
  quadrant: task.quadrant,
  dueDate: task.dueDate
    ? formatDateField(new Date(task.dueDate), language)
    : '',
  folderId: task.folderId,
});

/**
 * Checks the form and builds what the API expects: trimmed title (required),
 * null for an empty description or date, due date at local midnight.
 */
export const validateTaskForm = (
  values: TaskFormValues,
  language: string,
): TaskFormResult => {
  const errors: TaskFormErrors = {};
  const title = values.title.trim();
  if (!title) errors.title = 'form.errors.titleRequired';

  const typedDate = values.dueDate.trim();
  const dueDate = typedDate ? parseDateField(typedDate, language) : null;
  if (typedDate && !dueDate) errors.dueDate = 'form.errors.dueDateInvalid';

  if (errors.title || errors.dueDate) return { isValid: false, errors };

  return {
    isValid: true,
    input: {
      title,
      description: values.description.trim() || null,
      quadrant: values.quadrant,
      dueDate: dueDate ? dueDate.toISOString() : null,
      folderId: values.folderId,
    },
  };
};
