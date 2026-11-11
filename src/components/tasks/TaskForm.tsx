import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentRef, JSX } from 'react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TextInput } from 'react-native';
import { Text, View } from 'react-native';
import type { TaskInput } from '@/src/api/tasks';
import { useScreenSize } from '@/src/layout/screenSize';
import type { TaskFormErrors, TaskFormValues } from '@/src/tasks/taskForm';
import { validateTaskForm } from '@/src/tasks/taskForm';
import { useIconColors } from '@/src/theme/useIconColors';
import type { Folder } from '@/src/types/models';
import { Button } from '../ui/Button';
import { TextField } from '../ui/TextField';
import { FolderSelect } from './FolderSelect';
import { QuadrantPicker } from './QuadrantPicker';

interface TaskFormProps {
  initialValues: TaskFormValues;
  folders: Folder[];
  submitLabel: string;
  /** Saves the task; a rejection shows a "couldn't save" message. */
  onSubmit: (input: TaskInput) => Promise<void>;
  onCancel: () => void;
}

/** Fields of the task modal (create and edit), in the mockup's order. */
export function TaskForm({
  initialValues,
  folders,
  submitLabel,
  onSubmit,
  onCancel,
}: TaskFormProps): JSX.Element {
  const { t, i18n } = useTranslation('tasks');
  const iconColors = useIconColors();
  const isSheet = useScreenSize() === 'small';
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<TaskFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const isSavingRef = useRef(false);
  const [hasSaveFailed, setHasSaveFailed] = useState(false);
  const titleRef = useRef<ComponentRef<typeof TextInput>>(null);
  const dueDateRef = useRef<ComponentRef<typeof TextInput>>(null);

  const update = <Field extends keyof TaskFormValues>(
    field: Field,
    value: TaskFormValues[Field],
  ): void => {
    setValues((current) => ({ ...current, [field]: value }));
    // Typing again clears that field's error (as in the mockup).
    if (field === 'title' || field === 'dueDate') {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const handleSubmit = async (): Promise<void> => {
    // One save at a time: Enter in the title can fire again while the
    // button already shows its spinner (a second POST would duplicate the
    // task). A ref, unlike the state, is up to date between two key presses.
    if (isSavingRef.current) return;

    const result = validateTaskForm(values, i18n.language);
    if (!result.isValid) {
      setErrors(result.errors);
      // Focus goes to the first field in error.
      (result.errors.title ? titleRef : dueDateRef).current?.focus();
      return;
    }

    setErrors({});
    setHasSaveFailed(false);
    isSavingRef.current = true;
    setIsSaving(true);
    try {
      await onSubmit(result.input);
      // Success: the modal closes, nothing left to reset.
    } catch {
      // Already reported by the QueryClient's MutationCache.
      setHasSaveFailed(true);
      isSavingRef.current = false;
      setIsSaving(false);
    }
  };

  return (
    <View className="gap-4">
      <TextField
        label={t('form.title')}
        placeholder={t('form.titlePlaceholder')}
        value={values.title}
        onChangeText={(text) => update('title', text)}
        error={errors.title ? t(errors.title) : null}
        inputRef={titleRef}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={() => void handleSubmit()}
        containerClassName=""
      />

      <QuadrantPicker
        value={values.quadrant}
        onChange={(quadrant) => update('quadrant', quadrant)}
      />

      <TextField
        label={t('form.description')}
        optionalLabel={t('form.optional')}
        placeholder={t('form.descriptionPlaceholder')}
        value={values.description}
        onChangeText={(text) => update('description', text)}
        multiline
        numberOfLines={3}
        containerClassName=""
      />

      {/* Side by side on every screen size, as in the mockup. */}
      <View className="flex-row gap-3">
        <TextField
          label={t('form.dueDate')}
          icon="calendar-outline"
          placeholder={t('form.dueDatePlaceholder')}
          value={values.dueDate}
          onChangeText={(text) => update('dueDate', text)}
          error={errors.dueDate ? t(errors.dueDate) : null}
          inputRef={dueDateRef}
          keyboardType="numbers-and-punctuation"
          containerClassName="flex-1"
        />
        <View className="flex-1">
          <FolderSelect
            folders={folders}
            value={values.folderId}
            onChange={(folderId) => update('folderId', folderId)}
          />
        </View>
      </View>

      {hasSaveFailed && (
        <View
          accessibilityRole="alert"
          className="flex-row items-center gap-2 rounded-sm bg-critical-bg px-3 py-2.5"
        >
          <Ionicons
            name="warning-outline"
            aria-hidden
            size={16}
            color={iconColors.critical}
          />
          <Text className="flex-1 font-sans text-caption text-critical">
            {t('form.errors.saveFailed')}
          </Text>
        </View>
      )}

      <View
        className={`flex-row gap-3 pb-7 pt-2 ${isSheet ? '' : 'justify-end'}`}
      >
        <Button
          label={t('form.cancel')}
          variant="outline"
          onPress={onCancel}
          className={isSheet ? 'flex-1' : 'w-28'}
        />
        <Button
          label={submitLabel}
          onPress={() => void handleSubmit()}
          isLoading={isSaving}
          className={isSheet ? 'flex-1' : 'min-w-44'}
        />
      </View>
    </View>
  );
}
