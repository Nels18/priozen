import { useWindowDimensions } from 'react-native';

/**
 * Size class of the available width — not the device type: a narrow desktop
 * window is "small", a phone in landscape can be "medium".
 * - small: header + bottom nav
 * - medium: sidebar + header
 * - large: sidebar + header + right panel
 */
export type ScreenSize = 'small' | 'medium' | 'large';

/** Minimum width (px) of each size class, from the DASH-01 ticket. */
export const BREAKPOINTS = { medium: 768, large: 1280 } as const;

export const getScreenSize = (width: number): ScreenSize => {
  if (width >= BREAKPOINTS.large) return 'large';
  if (width >= BREAKPOINTS.medium) return 'medium';
  return 'small';
};

/** Current size class, updated on resize / rotation. */
export const useScreenSize = (): ScreenSize =>
  getScreenSize(useWindowDimensions().width);
