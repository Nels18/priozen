import { describe, expect, it } from 'vitest';
import { NAMESPACES, resources } from './resources';

const collectKeys = (node: object, prefix = ''): string[] =>
  Object.entries(node).flatMap(([key, value]: [string, unknown]) =>
    typeof value === 'object' && value !== null
      ? collectKeys(value, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  );

describe('locales', () => {
  it('declares the same namespaces in every language', (): void => {
    expect(Object.keys(resources.en).sort()).toEqual([...NAMESPACES].sort());
  });

  it.each(NAMESPACES)(
    'defines the same keys in fr and en for "%s"',
    (namespace): void => {
      expect(collectKeys(resources.en[namespace]).sort()).toEqual(
        collectKeys(resources.fr[namespace]).sort(),
      );
    },
  );
});
