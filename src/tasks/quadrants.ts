import type { EisenhowerQuadrant } from '../types/models';

export { EISENHOWER_QUADRANTS } from '../types/models';

interface QuadrantClasses {
  /** Small colored dot (group headers, right panel). */
  dot: string;
  /** Badge: tinted background + colored text. */
  badge: string;
  /** Colored text alone. */
  text: string;
}

// Single place mapping each quadrant to its theme colors (global.css tokens).
// Full literal class names so Tailwind finds them when scanning the code.
// Labels live in the "tasks" i18n namespace: t(`quadrants.${quadrant}`).
export const QUADRANT_CLASSES: Record<EisenhowerQuadrant, QuadrantClasses> = {
  critical: {
    dot: 'bg-critical',
    badge: 'bg-critical-bg text-critical',
    text: 'text-critical',
  },
  schedule: {
    dot: 'bg-schedule',
    badge: 'bg-schedule-bg text-schedule',
    text: 'text-schedule',
  },
  delegate: {
    dot: 'bg-delegate',
    badge: 'bg-delegate-bg text-delegate',
    text: 'text-delegate',
  },
  secondary: {
    dot: 'bg-secondary',
    badge: 'bg-secondary-bg text-secondary',
    text: 'text-secondary',
  },
};
