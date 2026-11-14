import { Icon } from '@/src/components/ui/Icon';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

/**
 * Thin strip above every screen of the public demo: its data is fictitious.
 * Web only (see app/_layout.tsx): no safe-area inset to handle, the screens'
 * headers already do it on iOS / Android.
 */
export function DemoBanner(): JSX.Element {
  const { t } = useTranslation('common');

  return (
    <View className="flex-row items-center justify-center gap-1.5 bg-primary-light px-4 py-1.5">
      <Icon name="flask-outline" size={14} color="primary" />
      <Text className="font-sans-medium text-caption text-primary">
        {t('demoBanner')}
      </Text>
    </View>
  );
}
