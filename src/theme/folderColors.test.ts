import { describe, expect, it } from 'vitest';
import { contrast, MIN_MARK_CONTRAST, toRgb } from '../test/contrast';
import fixedColors from './fixedColors';
import { DEFAULT_FOLDER_COLOR, FOLDER_COLORS } from './folderColors';

// Page and card backgrounds, light and dark (global.css --color-page / -card).
const BACKGROUNDS = ['#F9FAFB', '#FFFFFF', '#0A0918', '#13111F'];
// Hue gap with the red, indigo and amber quadrants, in degrees.
const MIN_HUE_GAP = 25;
// The secondary quadrant is a gray, which has no meaningful hue: folder colors
// stay away from it by being saturated (HSL saturation, 0 to 1).
const MIN_SATURATION = 0.5;
const { secondary, ...colorfulQuadrants } = fixedColors.quadrant;

const hue = (hex: string): number => {
  const [r, g, b] = toRgb(hex);
  const max = Math.max(r, g, b);
  const delta = max - Math.min(r, g, b);
  if (delta === 0) return 0;
  const sector =
    max === r
      ? ((g - b) / delta) % 6
      : max === g
        ? (b - r) / delta + 2
        : (r - g) / delta + 4;
  return (sector * 60 + 360) % 360;
};

const saturation = (hex: string): number => {
  const [r, g, b] = toRgb(hex);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  return max === min ? 0 : (max - min) / (1 - Math.abs(2 * lightness - 1));
};

const hueGap = (a: string, b: string): number => {
  const gap = Math.abs(hue(a) - hue(b));
  return Math.min(gap, 360 - gap);
};

describe('FOLDER_COLORS', () => {
  it('has 8 distinct colors, the default among them', (): void => {
    expect(new Set(FOLDER_COLORS).size).toBe(8);
    expect(FOLDER_COLORS).toContain(DEFAULT_FOLDER_COLOR);
  });

  it.each(FOLDER_COLORS)(
    '%s keeps a 3:1 contrast on every background',
    (color): void => {
      BACKGROUNDS.forEach((background) => {
        expect(contrast(color, background)).toBeGreaterThanOrEqual(
          MIN_MARK_CONTRAST,
        );
      });
    },
  );

  it.each(FOLDER_COLORS)(
    '%s does not look like a quadrant color',
    (color): void => {
      Object.values(colorfulQuadrants).forEach((quadrantColor) => {
        expect(hueGap(color, quadrantColor)).toBeGreaterThanOrEqual(
          MIN_HUE_GAP,
        );
      });
      expect(saturation(color)).toBeGreaterThanOrEqual(MIN_SATURATION);
    },
  );

  // Premise of the saturation check above: the secondary quadrant is a gray.
  it('treats the secondary quadrant as a gray', (): void => {
    expect(saturation(secondary)).toBeLessThan(MIN_SATURATION);
  });
});
