import type { Toast, ToastAction, ToastHold } from './toastQueue';
import { addToast, droppedToastIds, removeToast } from './toastQueue';
import { ToastTimers } from './toastTimers';

export interface ToastApi {
  /** Shows a green-check toast; returns its id (to dismiss it early). */
  success: (message: string, action?: ToastAction) => string;
  /** Shows a red-alert toast; returns its id. */
  error: (message: string, action?: ToastAction) => string;
  dismiss: (id: string) => void;
}

/** What the toast layer draws; a new object only when something changed. */
export interface ToastSnapshot {
  toasts: readonly Toast[];
  /** Countdowns stopped: a toast is hovered or its action focused. */
  isPaused: boolean;
  /** Distance from the bottom edge, set by the screen layout; null = default. */
  bottomOffset: number | null;
}

/**
 * The app's toasts, outside React: every method is created once, so
 * `useToast()` hands out stable functions (effects that depend on them do not
 * rerun at each toast). Read in React with useSyncExternalStore.
 */
export class ToastStore {
  private snapshot: ToastSnapshot = {
    toasts: [],
    isPaused: false,
    bottomOffset: null,
  };

  private readonly listeners = new Set<() => void>();
  private readonly timers: ToastTimers;
  private nextId = 0;

  /** `announce` reads a new toast out loud (screen readers without a live region). */
  constructor(
    private readonly announce: (message: string) => void = (): void =>
      undefined,
    now?: () => number,
  ) {
    this.timers = new ToastTimers(now);
  }

  readonly subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return (): void => {
      this.listeners.delete(listener);
    };
  };

  readonly getSnapshot = (): ToastSnapshot => this.snapshot;

  readonly dismiss = (id: string): void =>
    this.setToasts(removeToast(this.snapshot.toasts, id));

  readonly api: ToastApi = {
    success: (message, action) => this.show('success', message, action),
    error: (message, action) => this.show('error', message, action),
    dismiss: this.dismiss,
  };

  /** Runs a toast's action ("Annuler"), after taking the toast away. */
  readonly runAction = (toast: Toast): void => {
    this.dismiss(toast.id);
    toast.action?.onPress();
  };

  readonly hold = (id: string, reason: ToastHold): void => {
    this.timers.hold(id, reason);
    this.syncPause();
  };

  readonly release = (id: string, reason: ToastHold): void => {
    this.timers.release(id, reason);
    this.syncPause();
  };

  readonly setBottomOffset = (offset: number | null): void => {
    if (offset === this.snapshot.bottomOffset) return;
    this.emit({ ...this.snapshot, bottomOffset: offset });
  };

  /** Stops every countdown (provider unmounted). */
  clear(): void {
    this.timers.clear();
  }

  private show(
    kind: Toast['kind'],
    message: string,
    action?: ToastAction,
  ): string {
    this.nextId += 1;
    const id = `toast-${this.nextId}`;
    this.setToasts(
      addToast(this.snapshot.toasts, { id, kind, message, action }),
    );
    this.timers.start(id, () => this.dismiss(id));
    this.announce(message);
    return id;
  }

  private setToasts(toasts: Toast[]): void {
    // Toasts pushed out or dismissed: their countdowns and holds go too.
    droppedToastIds(this.snapshot.toasts, toasts).forEach((id) =>
      this.timers.forget(id),
    );
    this.emit({ ...this.snapshot, toasts, isPaused: this.timers.isPaused });
  }

  private syncPause(): void {
    if (this.timers.isPaused === this.snapshot.isPaused) return;
    this.emit({ ...this.snapshot, isPaused: this.timers.isPaused });
  }

  private emit(snapshot: ToastSnapshot): void {
    this.snapshot = snapshot;
    this.listeners.forEach((listener) => listener());
  }
}
