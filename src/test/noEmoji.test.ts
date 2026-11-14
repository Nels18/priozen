import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// No emoji in the UI (CLAUDE.md, UX-04): every pictogram is an Icon. Emojis
// render differently on iOS, Android and the web and ignore the theme.
const ROOT = join(__dirname, '..', '..');
const SCANNED_DIRS = ['app', 'src'];
const SCANNED_FILE = /\.(tsx?|jsx?|json)$/;
// Characters drawn as emoji: emoji by default (waving hand U+1F44B), or forced
// by the variation selector U+FE0F (sun U+2600 U+FE0F). Text symbols such as
// arrows (U+2194) or the multiplication X (U+2715) stay allowed.
const EMOJI = /\p{Emoji_Presentation}|\p{Extended_Pictographic}\uFE0F/u;

const listFiles = (dir: string): string[] =>
  readdirSync(join(ROOT, dir), { recursive: true, encoding: 'utf8' })
    .filter((path) => SCANNED_FILE.test(path))
    .map((path) => join(dir, path));

const findEmojiLines = (file: string): string[] =>
  readFileSync(join(ROOT, file), 'utf8')
    .split('\n')
    .flatMap((line, index) =>
      EMOJI.test(line) ? [`${file}:${index + 1}`] : [],
    );

describe('no emoji', () => {
  it('finds files to scan', (): void => {
    expect(SCANNED_DIRS.flatMap(listFiles).length).toBeGreaterThan(50);
  });

  it('has no emoji in app/ and src/ (use the Icon component)', (): void => {
    expect(SCANNED_DIRS.flatMap(listFiles).flatMap(findEmojiLines)).toEqual([]);
  });
});
