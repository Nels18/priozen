import { Redirect } from 'expo-router';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useAuth } from '@/src/auth/AuthProvider';

// Placeholder dashboard: proves the post-login redirect. Replaced by DASH-01.
export default function Index(): JSX.Element {
  const { t } = useTranslation('dashboard');
  const { session, signOut } = useAuth();

  if (!session) return <Redirect href="/login" />;

  return (
    <View className="flex-1 items-center justify-center bg-page px-4">
      <Text className="font-sans text-[13px] text-muted">{t('greeting')}</Text>
      <Text className="mb-6 font-serif text-[26px] text-text">
        {t('greetingName', { firstName: session.user.firstName })}
      </Text>
      <Pressable accessibilityRole="button" onPress={signOut}>
        <Text className="font-sans-medium text-[13px] text-primary">
          {t('signOut')}
        </Text>
      </Pressable>
    </View>
  );
}
