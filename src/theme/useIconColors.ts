import { useColorScheme } from 'react-native';
import fixedColors from './fixedColors';

// Icons and other props that take a raw color can't use NativeWind classes:
// these mirror the global.css tokens for each theme. Keep them in sync.
// Colors identical in both themes come from fixedColors.
const SHARED_COLORS = {
  critical: fixedColors.critical,
  white: fixedColors.white,
  // Sidebar foreground: the sidebar stays dark in both themes.
  sidebarText: fixedColors.sidebar.text,
  // Quadrant colors, named after the quadrant (critical is the red above).
  schedule: fixedColors.quadrant.schedule,
  delegate: fixedColors.quadrant.delegate,
  secondary: fixedColors.quadrant.secondary,
} as const;

const ICON_COLORS = {
  light: { primary: '#4F46E5', muted: '#64748B', ...SHARED_COLORS },
  dark: { primary: '#818CF8', muted: '#94A3B8', ...SHARED_COLORS },
} as const;

export type IconColors = (typeof ICON_COLORS)['light' | 'dark'];

/** A color token an icon can take (see Icon). */
export type IconColor = keyof IconColors;

export const useIconColors = (): IconColors =>
  ICON_COLORS[useColorScheme() === 'dark' ? 'dark' : 'light'];
