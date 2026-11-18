/** Success: green check. Error: red alert. Both on the dark toast (mockup). */
export type ToastKind = 'success' | 'error';

export interface ToastAction {
  /** Already translated, e.g. "Annuler". */
  label: string;
  onPress: () => void;
}

export interface Toast {
  id: string;
  kind: ToastKind;
  /** Already translated. */
  message: string;
  action?: ToastAction;
}

/** Shown at most at once: a new toast pushes the oldest one out. */
export const MAX_TOASTS = 3;

/** Time a toast stays on screen, shown by its countdown bar. */
export const TOAST_DURATION_MS = 5000;

/** Adds a toast at the end (closest to the screen edge), keeping 3 at most. */
export const addToast = (toasts: readonly Toast[], toast: Toast): Toast[] =>
  [...toasts, toast].slice(-MAX_TOASTS);

export const removeToast = (toasts: readonly Toast[], id: string): Toast[] =>
  toasts.filter((toast) => toast.id !== id);

/**
 * What keeps the toasts on screen past their time: the pointer over one
 * (web), or the keyboard focus on its action. Countdowns resume once released.
 */
export type ToastHold = 'hover' | 'focus';

/** Time left on a countdown of `remainingMs` started at `startedAt`. */
export const remainingAfter = (
  remainingMs: number,
  startedAt: number,
  now: number,
): number => Math.max(0, remainingMs - (now - startedAt));

/** Toasts that `next` no longer shows: their timers can be cleared. */
export const droppedToastIds = (
  previous: readonly Toast[],
  next: readonly Toast[],
): string[] =>
  previous
    .filter((toast) => !next.some((kept) => kept.id === toast.id))
    .map((toast) => toast.id);
