import { describe, expect, it } from 'vitest';
import { getIsDemo, getIsMocksEnabled } from './demo';

describe('getIsMocksEnabled', () => {
  it('runs the mocks in development by default', (): void => {
    expect(
      getIsMocksEnabled({ useMocks: undefined, nodeEnv: 'development' }),
    ).toBe(true);
    expect(
      getIsMocksEnabled({ useMocks: undefined, nodeEnv: 'production' }),
    ).toBe(false);
  });

  it('follows EXPO_PUBLIC_USE_MOCKS when it is set', (): void => {
    expect(getIsMocksEnabled({ useMocks: 'true', nodeEnv: 'production' })).toBe(
      true,
    );
    expect(
      getIsMocksEnabled({ useMocks: 'false', nodeEnv: 'development' }),
    ).toBe(false);
  });
});

describe('getIsDemo', () => {
  // Only the production build running on the mocks is the demo: in
  // development (mocks on too), no banner and no noindex.
  it.each([
    ['true', 'production', true],
    ['true', 'development', false],
    [undefined, 'production', false],
    [undefined, 'development', false],
    ['false', 'production', false],
  ])(
    'useMocks=%s nodeEnv=%s → %s',
    (
      useMocks: string | undefined,
      nodeEnv: string,
      expected: boolean,
    ): void => {
      expect(getIsDemo({ useMocks, nodeEnv })).toBe(expected);
    },
  );
});
