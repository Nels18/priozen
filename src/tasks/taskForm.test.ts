import { describe, expect, it } from 'vitest';
import type { Task } from '../types/models';
import {
  EMPTY_TASK_FORM,
  taskToFormValues,
  validateTaskForm,
} from './taskForm';

const task: Task = {
  id: 'task-1',
  title: 'Préparer la réunion client',
  description: 'Envoyer le support avant jeudi.',
  quadrant: 'critical',
  folderId: 'folder-1',
  userId: 'user-1',
  dueDate: new Date(2026, 10, 12).toISOString(),
  isDone: false,
  deletedAt: null,
  createdAt: '2026-11-01T00:00:00.000Z',
  updatedAt: '2026-11-01T00:00:00.000Z',
};

describe('EMPTY_TASK_FORM', () => {
  it('preselects "À planifier"', (): void => {
    expect(EMPTY_TASK_FORM.quadrant).toBe('schedule');
  });
});

describe('taskToFormValues', () => {
  it('prefills every field, with the date as typed in the language', (): void => {
    expect(taskToFormValues(task, 'fr')).toEqual({
      title: 'Préparer la réunion client',
      description: 'Envoyer le support avant jeudi.',
      quadrant: 'critical',
      dueDate: '12/11/2026',
      folderId: 'folder-1',
    });
    expect(taskToFormValues(task, 'en').dueDate).toBe('11/12/2026');
  });

  it('turns missing description and date into empty fields', (): void => {
    const values = taskToFormValues(
      { ...task, description: null, dueDate: null },
      'fr',
    );
    expect(values.description).toBe('');
    expect(values.dueDate).toBe('');
  });

  it('round-trips through validation unchanged', (): void => {
    const result = validateTaskForm(taskToFormValues(task, 'fr'), 'fr');
    expect(result).toEqual({
      isValid: true,
      input: {
        title: task.title,
        description: task.description,
        quadrant: task.quadrant,
        dueDate: task.dueDate,
        folderId: task.folderId,
      },
    });
  });
});

describe('validateTaskForm', () => {
  it('requires a title, spaces alone included', (): void => {
    expect(
      validateTaskForm({ ...EMPTY_TASK_FORM, title: '   ' }, 'fr'),
    ).toEqual({
      isValid: false,
      errors: { title: 'form.errors.titleRequired' },
    });
  });

  it('rejects a date that does not exist', (): void => {
    expect(
      validateTaskForm(
        { ...EMPTY_TASK_FORM, title: 'Tâche', dueDate: '31/02/2026' },
        'fr',
      ),
    ).toEqual({
      isValid: false,
      errors: { dueDate: 'form.errors.dueDateInvalid' },
    });
  });

  it('reports both errors at once', (): void => {
    const result = validateTaskForm(
      { ...EMPTY_TASK_FORM, dueDate: 'demain' },
      'fr',
    );
    expect(result.isValid).toBe(false);
    expect(!result.isValid && Object.keys(result.errors).sort()).toEqual([
      'dueDate',
      'title',
    ]);
  });

  it('trims the text and sends null for empty optional fields', (): void => {
    expect(
      validateTaskForm(
        {
          ...EMPTY_TASK_FORM,
          title: '  Appeler le client  ',
          description: ' ',
        },
        'fr',
      ),
    ).toEqual({
      isValid: true,
      input: {
        title: 'Appeler le client',
        description: null,
        quadrant: 'schedule',
        dueDate: null,
        folderId: null,
      },
    });
  });

  it('sends the due date at local midnight', (): void => {
    const result = validateTaskForm(
      { ...EMPTY_TASK_FORM, title: 'Tâche', dueDate: '05/03/2026' },
      'fr',
    );
    expect(result.isValid && result.input.dueDate).toBe(
      new Date(2026, 2, 5).toISOString(),
    );
  });
});
