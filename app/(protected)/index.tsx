import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';
import { useAuth } from '@/src/auth/AuthProvider';
import { ScreenPlaceholder } from '@/src/components/layout/ScreenPlaceholder';

// Tasks view: the grouped-by-quadrant list arrives with DASH-02.
export default function TasksScreen(): JSX.Element | null {
  const { t } = useTranslation('dashboard');
  const { session } = useAuth();
  if (!session) return null;

  return (
    <ScreenPlaceholder ticket="DASH-02">
      <Text className="mt-4 font-sans text-caption text-muted">
        {t('greeting')}
      </Text>
      <Text className="font-serif text-[26px] text-text">
        {t('greetingName', { firstName: session.user.firstName })}
      </Text>
    </ScreenPlaceholder>
  );
}
