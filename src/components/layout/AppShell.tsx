import { usePathname } from 'expo-router';
import type { JSX, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useScreenSize } from '@/src/layout/screenSize';
import { getActiveNavItem } from '@/src/navigation/navItems';
import type { User } from '@/src/types/models';
import { BottomNav } from './BottomNav';
import { Fab } from './Fab';
import { MobileHeader } from './MobileHeader';
import { PageHeader } from './PageHeader';
import { RightPanel } from './RightPanel';
import { Sidebar } from './Sidebar';

const SIDEBAR_WIDTH = { medium: 240, large: 260 } as const;
// Bottom nav height without the safe-area inset (icon + label + paddings).
const BOTTOM_NAV_HEIGHT = 64;

interface AppShellProps {
  user: User;
  children: ReactNode;
}

/**
 * Layout around every signed-in screen (responsive mockup):
 * - small: header + content + bottom nav, "+" button on the tasks view
 * - medium: sidebar + header + content
 * - large: same as medium + right summary panel
 */
export function AppShell({ user, children }: AppShellProps): JSX.Element {
  const { t } = useTranslation('layout');
  const screenSize = useScreenSize();
  const insets = useSafeAreaInsets();
  const isTasksView = getActiveNavItem(usePathname()).key === 'tasks';

  if (screenSize === 'small') {
    return (
      <View className="flex-1 bg-page">
        <MobileHeader user={user} />
        <View className="flex-1">{children}</View>
        <BottomNav />
        {isTasksView && (
          <Fab
            label={t('newTask')}
            // TODO(TASK-01): open the "new task" modal.
            onPress={(): void => undefined}
            bottom={BOTTOM_NAV_HEIGHT + insets.bottom + 16}
          />
        )}
      </View>
    );
  }

  return (
    <View className="flex-1 flex-row bg-page">
      <Sidebar user={user} width={SIDEBAR_WIDTH[screenSize]} />
      <View className="flex-1">
        <PageHeader user={user} />
        <View className="flex-1">{children}</View>
      </View>
      {screenSize === 'large' && <RightPanel />}
    </View>
  );
}
