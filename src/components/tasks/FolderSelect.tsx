import Ionicons from '@expo/vector-icons/Ionicons';
import type { JSX } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useIconColors } from '@/src/theme/useIconColors';
import type { Folder } from '@/src/types/models';

interface FolderSelectProps {
  folders: Folder[];
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
  value,
  onChange,
}: FolderSelectProps): JSX.Element {
  const { t } = useTranslation('tasks');
  const iconColors = useIconColors();
  const [isOpen, setIsOpen] = useState(false);

  const options: Option[] = [
    { id: null, name: t('form.noFolder'), color: null },
    ...folders.map((folder) => ({
      id: folder.id,
      name: folder.name,
      color: folder.color,
    })),
  ];
  const current = options.find((option) => option.id === value) ?? options[0];

  return (
    <View>
      <Text className="mb-1.5 font-sans-semibold text-caption text-text">
        {t('form.folder')}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('form.folderButton', {
          label: t('form.folder'),
          name: current.name,
        })}
        aria-expanded={isOpen}
        onPress={() => setIsOpen((open) => !open)}
        className={`min-h-11 flex-row items-center gap-2 rounded-sm border-[1.5px] bg-input px-3 ${
          isOpen ? 'border-primary' : 'border-border'
        }`}
      >
        <Ionicons
          name="folder-outline"
          aria-hidden
          size={20}
          color={iconColors.muted}
        />
        <Text numberOfLines={1} className="flex-1 font-sans text-sm text-text">
          {current.name}
        </Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          aria-hidden
          size={16}
          color={iconColors.muted}
        />
      </Pressable>

      {isOpen && (
        <View
          accessibilityRole="radiogroup"
          accessibilityLabel={t('form.folder')}
          className="mt-1 overflow-hidden rounded-sm border border-border bg-card"
        >
          {options.map((option) => {
            const isSelected = option.id === current.id;
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
                  <Ionicons
                    name="checkmark"
                    aria-hidden
                    size={16}
                    color={iconColors.primary}
                  />
                )}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
