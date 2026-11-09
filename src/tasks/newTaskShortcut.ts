/** The parts of a keyboard event the shortcut looks at. */
export interface ShortcutKeyEvent {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  target: unknown;
}

const TEXT_TAGS = ['INPUT', 'TEXTAREA', 'SELECT'];

const isTyping = (target: unknown): boolean => {
  if (typeof target !== 'object' || target === null) return false;
  const element = target as { tagName?: unknown; isContentEditable?: unknown };
  return (
    (typeof element.tagName === 'string' &&
      TEXT_TAGS.includes(element.tagName)) ||
    element.isContentEditable === true
  );
};

/**
 * "N" alone opens a new task — never while typing in a field, nor with a
 * modifier (Ctrl+N, ⌘N stay the browser's).
 */
export const isNewTaskShortcut = (event: ShortcutKeyEvent): boolean =>
  event.key.toLowerCase() === 'n' &&
  !event.ctrlKey &&
  !event.metaKey &&
  !event.altKey &&
  !isTyping(event.target);
