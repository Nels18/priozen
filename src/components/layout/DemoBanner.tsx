import Ionicons from '@expo/vector-icons/Ionicons';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useIconColors } from '@/src/theme/useIconColors';

/**
 * Thin strip above every screen of the public demo: its data is fictitious.
 * Web only (see app/_layout.tsx): no safe-area inset to handle, the screens'
 * headers already do it on iOS / Android.
 */
export function DemoBanner(): JSX.Element {
  const { t } = useTranslation('common');
  const iconColors = useIconColors();

  return (
    <View className="flex-row items-center justify-center gap-1.5 bg-primary-light px-4 py-1.5">
      <Ionicons
        name="flask-outline"
        aria-hidden
        size={14}
        color={iconColors.primary}
      />
      <Text className="font-sans-medium text-caption text-primary">
        {t('demoBanner')}
      </Text>
    </View>
  );
}
