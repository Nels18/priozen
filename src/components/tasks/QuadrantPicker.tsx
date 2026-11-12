import Ionicons from '@expo/vector-icons/Ionicons';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { EISENHOWER_QUADRANTS, QUADRANT_CLASSES } from '@/src/tasks/quadrants';
import fixedColors from '@/src/theme/fixedColors';
import type { EisenhowerQuadrant } from '@/src/types/models';

interface QuadrantPickerProps {
  value: EisenhowerQuadrant;
  onChange: (quadrant: EisenhowerQuadrant) => void;
}

// The Eisenhower matrix, read row by row: Critique, À planifier / À
// déléguer, Secondaire.
const ROWS: EisenhowerQuadrant[][] = [
  EISENHOWER_QUADRANTS.slice(0, 2),
  EISENHOWER_QUADRANTS.slice(2, 4),
];

/** Four exclusive choices laid out as the Eisenhower matrix (2×2). */
export function QuadrantPicker({
  value,
  onChange,
}: QuadrantPickerProps): JSX.Element {
  const { t } = useTranslation('tasks');

  return (
    <View>
      <Text className="mb-1.5 font-sans-semibold text-caption text-text">
        {t('form.quadrant')}
      </Text>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={t('form.quadrant')}
        className="gap-2"
      >
        {ROWS.map((row) => (
          <View key={row.join('-')} className="flex-row gap-2">
            {row.map((quadrant) => {
              const isSelected = quadrant === value;
              const classes = QUADRANT_CLASSES[quadrant];
              return (
                <Pressable
                  key={quadrant}
                  accessibilityRole="radio"
                  // aria-*, not accessibilityState: see .github/review-guidelines.md.
                  aria-checked={isSelected}
                  accessibilityLabel={t('form.quadrantOption', {
                    name: t(`quadrants.${quadrant}`),
                    hint: t(`quadrantHints.${quadrant}`),
                  })}
                  onPress={() => onChange(quadrant)}
                  className={`min-h-16 flex-1 gap-0.5 rounded-md border-2 px-3 py-2.5 ${
                    isSelected ? classes.selected : 'border-border bg-input'
                  }`}
                >
                  <View className="flex-row items-center gap-2">
                    <View className={`h-2 w-2 rounded-full ${classes.dot}`} />
                    <Text className="flex-1 font-sans-semibold text-caption text-text">
                      {t(`quadrants.${quadrant}`)}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        aria-hidden
                        size={16}
                        color={fixedColors.quadrant[quadrant]}
                      />
                    )}
                  </View>
                  <Text className="font-sans text-xs text-muted">
                    {t(`quadrantHints.${quadrant}`)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}
