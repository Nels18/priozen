import { usePathname } from 'expo-router';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { getActiveNavItem } from '@/src/navigation/navItems';
import type { User } from '@/src/types/models';
import { formatLongDate } from '@/src/utils/format';
import { Avatar } from '../ui/Avatar';

/** Medium/large screens header: view title, today's date and the avatar. */
export function PageHeader({ user }: { user: User }): JSX.Element {
  const { t, i18n } = useTranslation('layout');
  const activeKey = getActiveNavItem(usePathname()).key;

  return (
    <View className="flex-row items-center justify-between border-b border-border bg-card px-7 py-5">
      <View>
        <Text
          accessibilityRole="header"
          className="font-sans-bold text-xl tracking-tight text-text"
        >
          {t(`titles.${activeKey}`)}
        </Text>
        <Text className="mt-0.5 font-sans text-caption text-muted">
          {formatLongDate(new Date(), i18n.language)}
        </Text>
      </View>
      <Avatar user={user} size="md" />
    </View>
  );
}
