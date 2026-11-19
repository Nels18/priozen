// WCAG color math for the theme tests (folder colors, text contrast).

/** Text (1.4.3) and non-text marks such as icons or borders (1.4.11). */
export const MIN_TEXT_CONTRAST = 4.5;
export const MIN_MARK_CONTRAST = 3;

/** "#4F46E5" → [r, g, b], each 0 to 1. */
export const toRgb = (hex: string): number[] =>
  [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255);

const luminance = (hex: string): number => {
  const [r, g, b] = toRgb(hex).map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** WCAG contrast ratio, 1 to 21, whatever the order of the two colors. */
export const contrast = (a: string, b: string): number => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
};
