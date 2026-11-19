import { LinearGradient } from 'expo-linear-gradient';
import type { JSX } from 'react';
import { View } from 'react-native';
import { useIconColors } from '@/src/theme/useIconColors';

interface ProgressBarProps {
  /** What is measured, read by screen readers ("Tâches terminées"). */
  label: string;
  value: number;
  max: number;
  /** Filled share, 0–100 (computed once by the caller). */
  percent: number;
  className?: string;
}

// Left to right (90°): primary → primary-gradient-end (design system).
const GRADIENT_START = { x: 0, y: 0 };
const GRADIENT_END = { x: 1, y: 0 };

/** Thin progress bar, filled with the primary gradient. */
export function ProgressBar({
  label,
  value,
  max,
  percent,
  className = '',
}: ProgressBarProps): JSX.Element {
  const { primary, primaryGradientEnd } = useIconColors();

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max, now: value }}
      className={`h-1.5 overflow-hidden rounded-full bg-input ${className}`}
    >
      {/* A gradient takes raw colors (useIconColors), not classes. */}
      <LinearGradient
        colors={[primary, primaryGradientEnd]}
        start={GRADIENT_START}
        end={GRADIENT_END}
        style={{ width: `${percent}%`, height: '100%', borderRadius: 9999 }}
      />
    </View>
  );
}
