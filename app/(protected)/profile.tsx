import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text } from 'react-native';
import { useAuth } from '@/src/auth/AuthProvider';
import { ScreenPlaceholder } from '@/src/components/layout/ScreenPlaceholder';

// Full profile arrives with PROF-01; sign-out lives here meanwhile.
export default function ProfileScreen(): JSX.Element {
  const { t } = useTranslation();
  const { signOut } = useAuth();

  return (
    <ScreenPlaceholder ticket="PROF-01">
      <Pressable accessibilityRole="button" onPress={signOut} className="mt-4">
        <Text className="font-sans-medium text-caption text-critical">
          {t('signOut')}
        </Text>
      </Pressable>
    </ScreenPlaceholder>
  );
}
