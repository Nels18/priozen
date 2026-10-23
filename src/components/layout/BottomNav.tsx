import Ionicons from '@expo/vector-icons/Ionicons';
import { router, usePathname } from 'expo-router';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NavKey } from '@/src/navigation/navItems';
import { getActiveNavItem, NAV_ITEMS } from '@/src/navigation/navItems';
import { useIconColors } from '@/src/theme/useIconColors';

// The mockup shortens "Analytics" to "Stats" in the 5-tab bar.
const MOBILE_LABEL_KEY = {
  tasks: 'nav.tasks',
  folders: 'nav.folders',
  focus: 'nav.focus',
  analytics: 'nav.analyticsShort',
  profile: 'nav.profile',
} as const satisfies Record<NavKey, string>;

export function BottomNav(): JSX.Element {
  const { t } = useTranslation('layout');
  const insets = useSafeAreaInsets();
  const iconColors = useIconColors();
  const activeKey = getActiveNavItem(usePathname()).key;

  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={t('mainNavigation')}
      style={{ paddingBottom: insets.bottom + 8 }}
      className="flex-row border-t border-border bg-card pt-2"
    >
      {NAV_ITEMS.map((item) => {
        const isActive = item.key === activeKey;
        return (
          <Pressable
            key={item.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            onPress={(): void => router.navigate(item.href)}
            className="flex-1 items-center gap-0.5 px-1 py-1.5"
          >
            <Ionicons
              name={item.icon}
              size={20}
              color={isActive ? iconColors.primary : iconColors.muted}
            />
            <Text
              className={`font-sans-medium text-[10px] ${
                isActive ? 'text-primary' : 'text-muted'
              }`}
            >
              {t(MOBILE_LABEL_KEY[item.key])}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
