import type { JSX } from 'react';
import { View } from 'react-native';

interface ProgressBarProps {
  /** What is measured, read by screen readers ("Tâches terminées"). */
  label: string;
  value: number;
  max: number;
  /** Filled share, 0–100 (computed once by the caller). */
  percent: number;
  className?: string;
}

/** Thin primary-colored progress bar. */
export function ProgressBar({
  label,
  value,
  max,
  percent,
  className = '',
}: ProgressBarProps): JSX.Element {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max, now: value }}
      className={`h-1.5 overflow-hidden rounded-full bg-input ${className}`}
    >
      <View
        style={{ width: `${percent}%` }}
        className="h-full rounded-full bg-primary"
      />
    </View>
  );
}
