import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, JSX } from 'react';
import type { IconColor } from '@/src/theme/useIconColors';
import { useIconColors } from '@/src/theme/useIconColors';
import { getIconAccessibilityProps } from './iconAccessibility';

export type IconName = ComponentProps<typeof Ionicons>['name'];

/**
 * Sizes used by the mockup: 12 (inside a checkbox), 14 / 16 (next to caption /
 * body text), 18 (sidebar), 20 (fields, bottom nav), 22 (close), 28 (FAB).
 */
export type IconSize = 12 | 14 | 16 | 18 | 20 | 22 | 28;

interface IconProps {
  name: IconName;
  size: IconSize;
  /** Theme token: follows light / dark (useIconColors). */
  color: IconColor;
  /** Read by screen readers. Without it, the icon is decorative and hidden. */
  label?: string;
}

/** Every pictogram of the app: an Ionicons icon, never an emoji. */
export function Icon({ name, size, color, label }: IconProps): JSX.Element {
  const colors = useIconColors();

  return (
    <Ionicons
      name={name}
      size={size}
      color={colors[color]}
      {...getIconAccessibilityProps(label)}
    />
  );
}
