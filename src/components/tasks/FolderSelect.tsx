import { Icon } from '@/src/components/ui/Icon';
import type { JSX } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import type { FoldersStatus } from '@/src/folders/folderField';
import { getFolderFieldState } from '@/src/folders/folderField';
import type { Folder } from '@/src/types/models';

interface FolderSelectProps {
  folders: Folder[];
  /** Loading state of `folders`: the field is locked until they load. */
  foldersStatus: FoldersStatus;
  value: string | null;
  onChange: (folderId: string | null) => void;
}

interface Option {
  id: string | null;
  name: string;
  color: string | null;
}

/**
 * Folder field: a button showing the current folder that unfolds the list of
 * choices below it ("Aucun" first). No native select works the same on iOS,
 * Android and web.
 */
export function FolderSelect({
  folders,
  foldersStatus,
  value,
  onChange,
}: FolderSelectProps): JSX.Element {
  const { t } = useTranslation('tasks');
  const [isOpen, setIsOpen] = useState(false);

  const state = getFolderFieldState(value, folders, foldersStatus);
  const isLocked = state.kind !== 'ready';

  let currentLabel: string;
  if (state.kind === 'loading') currentLabel = t('form.foldersLoading');
  else if (state.kind === 'unavailable') {
    currentLabel = state.hasFolder
      ? t('form.folderUnavailable')
      : t('form.noFolder');
  } else currentLabel = state.folder?.name ?? t('form.noFolder');

  const options: Option[] = [
    { id: null, name: t('form.noFolder'), color: null },
    ...folders.map((folder) => ({
      id: folder.id,
      name: folder.name,
      color: folder.color,
    })),
  ];
  const selectedId = state.kind === 'ready' ? (state.folder?.id ?? null) : null;

  return (
    <View>
      <Text className="mb-1.5 font-sans-semibold text-caption text-text">
        {t('form.folder')}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('form.folderButton', {
          label: t('form.folder'),
          name: currentLabel,
        })}
        aria-expanded={isOpen && !isLocked}
        aria-disabled={isLocked}
        aria-busy={state.kind === 'loading'}
        disabled={isLocked}
        onPress={() => setIsOpen((open) => !open)}
        className={`min-h-11 flex-row items-center gap-2 rounded-sm border-[1.5px] bg-input px-3 ${
          isOpen && !isLocked ? 'border-primary' : 'border-border'
        } ${isLocked ? 'opacity-60' : ''}`}
      >
        <Icon name="folder-outline" size={20} color="muted" />
        <Text numberOfLines={1} className="flex-1 font-sans text-sm text-text">
          {currentLabel}
        </Text>
        {!isLocked && (
          <Icon
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size={16}
            color="muted"
          />
        )}
      </Pressable>

      {state.kind === 'unavailable' && (
        <View
          accessibilityRole="alert"
          className="mt-1.5 flex-row items-center gap-1.5"
        >
          <Icon name="alert-circle-outline" size={14} color="critical" />
          <Text className="flex-1 font-sans text-xs text-critical">
            {t('form.foldersLoadFailed')}
          </Text>
        </View>
      )}

      {isOpen && !isLocked && (
        <View
          accessibilityRole="radiogroup"
          accessibilityLabel={t('form.folder')}
          className="mt-1 overflow-hidden rounded-sm border border-border bg-card"
        >
          {options.map((option) => {
            const isSelected = option.id === selectedId;
            return (
              <Pressable
                key={option.id ?? 'none'}
                accessibilityRole="radio"
                // aria-*, not accessibilityState: see .github/review-guidelines.md.
                aria-checked={isSelected}
                accessibilityLabel={option.name}
                onPress={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
                className={`min-h-11 flex-row items-center gap-2 px-3 active:bg-input ${
                  isSelected ? 'bg-primary-light' : ''
                }`}
              >
                <View
                  className={`h-2 w-2 rounded-full ${
                    option.color ? '' : 'border border-muted'
                  }`}
                  // Folder colors are user data, not theme tokens.
                  style={
                    option.color ? { backgroundColor: option.color } : null
                  }
                />
                <Text className="flex-1 font-sans text-sm text-text">
                  {option.name}
                </Text>
                {isSelected && (
                  <Icon name="checkmark" size={16} color="primary" />
                )}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
