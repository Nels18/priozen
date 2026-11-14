/** Accessibility props of an icon (see Icon). */
export type IconAccessibilityProps =
  { 'aria-hidden': true } | { role: 'img'; 'aria-label': string };

/**
 * Without a label the icon is decorative and hidden from screen readers; with
 * one, it is read as an image. React Native maps these ARIA props on iOS and
 * Android too (accessibilityElementsHidden, importantForAccessibility…).
 */
export const getIconAccessibilityProps = (
  label?: string,
): IconAccessibilityProps =>
  label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true };
