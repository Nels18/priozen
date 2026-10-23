import { describe, expect, it } from 'vitest';
import { getScreenSize } from './screenSize';

describe('getScreenSize', () => {
  it.each([
    [320, 'small'],
    [767, 'small'],
    [768, 'medium'],
    [1279, 'medium'],
    [1280, 'large'],
    [1920, 'large'],
  ] as const)('maps %ipx to %s', (width, expected): void => {
    expect(getScreenSize(width)).toBe(expected);
  });
});
