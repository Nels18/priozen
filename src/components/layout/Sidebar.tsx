import Ionicons from '@expo/vector-icons/Ionicons';
import { router, usePathname } from 'expo-router';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import fixedColors from '@/src/theme/fixedColors';
import type { User } from '@/src/types/models';
import { getActiveNavItem, NAV_ITEMS } from '@/src/navigation/navItems';
import { Avatar } from '../ui/Avatar';
import { Logo } from '../ui/Logo';

interface SidebarProps {
  user: User;
  /** 240px on medium screens, 260px on large ones. */
  width: number;
}

export function Sidebar({ user, width }: SidebarProps): JSX.Element {
  const { t } = useTranslation('layout');
  const activeKey = getActiveNavItem(usePathname()).key;

  return (
    <View style={{ width }} className="bg-sidebar pb-5 pt-6">
      <View className="mb-2 border-b border-sidebar-divider px-6 pb-7">
        <Logo variant="inverse" className="text-2xl" />
      </View>

      <View
        accessibilityRole="menu"
        accessibilityLabel={t('mainNavigation')}
        className="flex-1 px-3 py-2"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = item.key === activeKey;
          return (
            <Pressable
              key={item.key}
              accessibilityRole="menuitem"
              accessibilityState={{ selected: isActive }}
              onPress={(): void => router.navigate(item.href)}
              className={`mb-0.5 flex-row items-center gap-3 rounded-sm px-3.5 py-2.5 hover:bg-sidebar-active ${
                isActive ? 'bg-sidebar-active' : ''
              }`}
            >
              <Ionicons
                name={item.icon}
                size={18}
                color={isActive ? fixedColors.white : fixedColors.sidebar.text}
              />
              <Text
                className={`font-sans-medium text-sm ${
                  isActive ? 'text-white' : 'text-sidebar-text'
                }`}
              >
                {t(`nav.${item.key}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View className="border-t border-sidebar-divider px-3 pt-4">
        <View className="flex-row items-center gap-2.5 px-3.5 py-2.5">
          <Avatar user={user} />
          <View className="flex-1">
            <Text
              numberOfLines={1}
              className="font-sans-semibold text-caption text-white"
            >
              {user.firstName} {user.lastName}
            </Text>
            <Text
              numberOfLines={1}
              className="font-sans text-[11px] text-sidebar-text"
            >
              {user.email}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
