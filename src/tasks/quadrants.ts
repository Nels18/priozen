import type { EisenhowerQuadrant } from '../types/models';

export { EISENHOWER_QUADRANTS } from '../types/models';

interface QuadrantClasses {
  /** Small colored dot (group headers, right panel). */
  dot: string;
  /** Badge: tinted background + colored text. */
  badge: string;
  /** Colored text alone. */
  text: string;
  /** Selected choice in the quadrant picker: colored border, tinted fill. */
  selected: string;
}

// Single place mapping each quadrant to its theme colors (global.css tokens).
// Full literal class names so Tailwind finds them when scanning the code.
// Labels live in the "tasks" i18n namespace: t(`quadrants.${quadrant}`).
// Text uses the -text shade (4.5:1) where the bright color is too light;
// dots and borders keep the bright one. Indigo text already reaches 4.5:1.
export const QUADRANT_CLASSES: Record<EisenhowerQuadrant, QuadrantClasses> = {
  critical: {
    dot: 'bg-critical',
    badge: 'bg-critical-bg text-critical-text',
    text: 'text-critical-text',
    selected: 'border-critical bg-critical-bg',
  },
  schedule: {
    dot: 'bg-schedule',
    badge: 'bg-schedule-bg text-schedule',
    text: 'text-schedule',
    selected: 'border-schedule bg-schedule-bg',
  },
  delegate: {
    dot: 'bg-delegate',
    badge: 'bg-delegate-bg text-delegate-text',
    text: 'text-delegate-text',
    selected: 'border-delegate bg-delegate-bg',
  },
  secondary: {
    dot: 'bg-secondary',
    badge: 'bg-secondary-bg text-secondary-text',
    text: 'text-secondary-text',
    selected: 'border-secondary bg-secondary-bg',
  },
};
