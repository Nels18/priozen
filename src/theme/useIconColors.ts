import { useColorScheme } from 'react-native';

// Icons and other props that take a raw color can't use NativeWind classes:
// these mirror the global.css tokens for each theme. Keep them in sync.
const ICON_COLORS = {
  light: { primary: '#4F46E5', muted: '#64748B' },
  dark: { primary: '#818CF8', muted: '#94A3B8' },
} as const;

export type IconColors = (typeof ICON_COLORS)['light' | 'dark'];

export const useIconColors = (): IconColors =>
  ICON_COLORS[useColorScheme() === 'dark' ? 'dark' : 'light'];
