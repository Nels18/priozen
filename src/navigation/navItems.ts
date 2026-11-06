import type Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import type { AppRoute } from './routes';
import { ROUTES } from './routes';

export type NavKey = 'tasks' | 'folders' | 'focus' | 'analytics' | 'profile';

export interface NavItem {
  key: NavKey;
  href: AppRoute;
  icon: ComponentProps<typeof Ionicons>['name'];
}

/** The 5 entries shared by the sidebar (medium/large) and the bottom nav (small). */
export const NAV_ITEMS: readonly NavItem[] = [
  { key: 'tasks', href: ROUTES.tasks, icon: 'checkbox-outline' },
  { key: 'folders', href: ROUTES.folders, icon: 'folder-outline' },
  { key: 'focus', href: ROUTES.focus, icon: 'timer-outline' },
  { key: 'analytics', href: ROUTES.analytics, icon: 'stats-chart-outline' },
  { key: 'profile', href: ROUTES.profile, icon: 'person-outline' },
];

/** Entry matching the current path ("/folders/12" → folders); tasks by default. */
export const getActiveNavItem = (pathname: string): NavItem =>
  NAV_ITEMS.find(
    (item) =>
      item.href !== ROUTES.tasks &&
      (pathname === item.href || pathname.startsWith(`${item.href}/`)),
  ) ?? NAV_ITEMS[0];
