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
  it('is the production build running on the mocks', (): void => {
    expect(getIsDemo({ useMocks: 'true', nodeEnv: 'production' })).toBe(true);
  });

  it('is neither development nor the real production', (): void => {
    expect(getIsDemo({ useMocks: undefined, nodeEnv: 'development' })).toBe(
      false,
    );
    expect(getIsDemo({ useMocks: undefined, nodeEnv: 'production' })).toBe(
      false,
    );
  });
});
