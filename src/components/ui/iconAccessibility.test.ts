import { describe, expect, it } from 'vitest';
import { getIconAccessibilityProps } from './iconAccessibility';

describe('getIconAccessibilityProps', () => {
  it('hides a decorative icon from screen readers', (): void => {
    expect(getIconAccessibilityProps()).toEqual({ 'aria-hidden': true });
  });

  it('treats an empty label as decorative', (): void => {
    expect(getIconAccessibilityProps('')).toEqual({ 'aria-hidden': true });
  });

  it('exposes a labelled icon as an image', (): void => {
    expect(getIconAccessibilityProps('En retard')).toEqual({
      role: 'img',
      'aria-label': 'En retard',
    });
  });
});
