import { describe, expect, it } from 'vitest';
import type { ShortcutKeyEvent } from './newTaskShortcut';
import { isNewTaskShortcut } from './newTaskShortcut';

const press = (
  overrides: Partial<ShortcutKeyEvent> = {},
): ShortcutKeyEvent => ({
  key: 'n',
  ctrlKey: false,
  metaKey: false,
  altKey: false,
  target: { tagName: 'DIV', isContentEditable: false },
  ...overrides,
});

describe('isNewTaskShortcut', () => {
  it('fires on "n" or "N" outside text fields', (): void => {
    expect(isNewTaskShortcut(press())).toBe(true);
    expect(isNewTaskShortcut(press({ key: 'N' }))).toBe(true);
    expect(isNewTaskShortcut(press({ target: null }))).toBe(true);
  });

  it.each(['INPUT', 'TEXTAREA', 'SELECT'])(
    'does not fire while typing in a %s',
    (tagName): void => {
      expect(isNewTaskShortcut(press({ target: { tagName } }))).toBe(false);
    },
  );

  it('does not fire in an editable element', (): void => {
    expect(
      isNewTaskShortcut(
        press({ target: { tagName: 'DIV', isContentEditable: true } }),
      ),
    ).toBe(false);
  });

  it('leaves Ctrl+N, ⌘N and Alt+N to the browser', (): void => {
    expect(isNewTaskShortcut(press({ ctrlKey: true }))).toBe(false);
    expect(isNewTaskShortcut(press({ metaKey: true }))).toBe(false);
    expect(isNewTaskShortcut(press({ altKey: true }))).toBe(false);
  });

  it('ignores other keys', (): void => {
    expect(isNewTaskShortcut(press({ key: 'm' }))).toBe(false);
  });
});
