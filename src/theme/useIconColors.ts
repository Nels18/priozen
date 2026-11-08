import { useColorScheme } from 'react-native';
import fixedColors from './fixedColors';

// Icons and other props that take a raw color can't use NativeWind classes:
// these mirror the global.css tokens for each theme. Keep them in sync.
// Colors identical in both themes come from fixedColors.
const ICON_COLORS = {
  light: {
    primary: '#4F46E5',
    muted: '#64748B',
    critical: fixedColors.critical,
  },
  dark: {
    primary: '#818CF8',
    muted: '#94A3B8',
    critical: fixedColors.critical,
  },
} as const;

export type IconColors = (typeof ICON_COLORS)['light' | 'dark'];

export const useIconColors = (): IconColors =>
  ICON_COLORS[useColorScheme() === 'dark' ? 'dark' : 'light'];
