import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  contrast,
  MIN_MARK_CONTRAST,
  MIN_TEXT_CONTRAST,
} from '../test/contrast';
import { ICON_COLORS } from './useIconColors';

// Every text / background pair of the theme reaches WCAG AA (UX-07), read
// straight from global.css so a token change can't slip through.
const ROOT = join(__dirname, '..', '..');
const GLOBAL_CSS = readFileSync(join(ROOT, 'global.css'), 'utf8');

type Theme = 'light' | 'dark';

/** "--color-card: 19 17 31;" → { card: "#13111F" } for one CSS block. */
const readTokens = (block: string): Record<string, string> =>
  Object.fromEntries(
    [...block.matchAll(/--color-([\w-]+):\s*(\d+) (\d+) (\d+);/g)].map(
      ([, name, ...channels]) => [
        name,
        `#${channels
          .map((channel) => Number(channel).toString(16).padStart(2, '0'))
          .join('')
          .toUpperCase()}`,
      ],
    ),
  );

const [lightBlock, darkBlock] = GLOBAL_CSS.split(
  '@media (prefers-color-scheme: dark)',
);
const lightTokens = readTokens(lightBlock);
// The dark block only overrides some tokens.
const TOKENS: Record<Theme, Record<string, string>> = {
  light: lightTokens,
  dark: { ...lightTokens, ...readTokens(darkBlock) },
};
const THEMES: Theme[] = ['light', 'dark'];

// [text token, background token]
const TEXT_PAIRS: [string, string][] = [
  ...[
    'text',
    'muted',
    'critical-text',
    'delegate-text',
    'secondary-text',
    'schedule',
  ].flatMap((text): [string, string][] => [
    [text, 'card'],
    [text, 'page'],
  ]),
  // Quadrant badges: colored text on its tinted background.
  ['critical-text', 'critical-bg'],
  ['schedule', 'schedule-bg'],
  ['delegate-text', 'delegate-bg'],
  ['secondary-text', 'secondary-bg'],
  // Buttons, "+" button, avatar.
  ['on-primary', 'primary'],
];

describe.each(THEMES)('%s theme', (theme) => {
  const tokens = TOKENS[theme];

  it.each(TEXT_PAIRS)(
    '%s text on %s reaches 4.5:1',
    (text, background): void => {
      expect(contrast(tokens[text], tokens[background])).toBeGreaterThanOrEqual(
        MIN_TEXT_CONTRAST,
      );
    },
  );

  it('keeps the unchecked checkbox border visible on the card (3:1)', (): void => {
    expect(contrast(tokens.muted, tokens.card)).toBeGreaterThanOrEqual(
      MIN_MARK_CONTRAST,
    );
  });

  it('gives useIconColors the same colors as global.css', (): void => {
    const icons = ICON_COLORS[theme];
    expect({
      primary: icons.primary,
      primaryGradientEnd: icons.primaryGradientEnd,
      onPrimary: icons.onPrimary,
      schedule: icons.schedule,
      muted: icons.muted,
      criticalText: icons.criticalText,
      delegateText: icons.delegateText,
      secondaryText: icons.secondaryText,
    }).toEqual({
      primary: tokens.primary,
      primaryGradientEnd: tokens['primary-gradient-end'],
      onPrimary: tokens['on-primary'],
      schedule: tokens.schedule,
      muted: tokens.muted,
      criticalText: tokens['critical-text'],
      delegateText: tokens['delegate-text'],
      secondaryText: tokens['secondary-text'],
    });
  });
});
