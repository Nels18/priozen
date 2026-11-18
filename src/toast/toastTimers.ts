import type { ToastHold } from './toastQueue';
import { remainingAfter, TOAST_DURATION_MS } from './toastQueue';

/** A toast's countdown; `handle` is undefined while paused. */
interface Countdown {
  onExpire: () => void;
  handle: ReturnType<typeof setTimeout> | undefined;
  startedAt: number;
  remainingMs: number;
}

const holdKey = (id: string, hold: ToastHold): string => `${hold}:${id}`;

/**
 * The toasts' countdowns. While something holds a toast (pointer over it,
 * focus on its action), every countdown pauses, so the stack never moves
 * under the pointer; they resume, with the time they had left, once released.
 */
export class ToastTimers {
  private readonly countdowns = new Map<string, Countdown>();
  // "hover:toast-1", "focus:toast-2"…
  private readonly holds = new Set<string>();
  private isPausedNow = false;

  constructor(private readonly now: () => number = Date.now) {}

  get isPaused(): boolean {
    return this.isPausedNow;
  }

  /** Calls `onExpire` after 5 seconds of countdown (pauses excluded). */
  start(id: string, onExpire: () => void): void {
    const countdown: Countdown = {
      onExpire,
      handle: undefined,
      startedAt: this.now(),
      remainingMs: TOAST_DURATION_MS,
    };
    this.countdowns.set(id, countdown);
    // Arriving during a pause, it waits with the others.
    if (!this.isPausedNow) this.run(countdown);
  }

  /** Drops a toast's countdown and holds: a removed toast gets no "leave". */
  forget(id: string): void {
    clearTimeout(this.countdowns.get(id)?.handle);
    this.countdowns.delete(id);
    this.holds.delete(holdKey(id, 'hover'));
    this.holds.delete(holdKey(id, 'focus'));
    this.sync();
  }

  hold(id: string, reason: ToastHold): void {
    if (!this.countdowns.has(id)) return;
    this.holds.add(holdKey(id, reason));
    this.sync();
  }

  release(id: string, reason: ToastHold): void {
    this.holds.delete(holdKey(id, reason));
    this.sync();
  }

  clear(): void {
    this.countdowns.forEach((countdown) => clearTimeout(countdown.handle));
    this.countdowns.clear();
    this.holds.clear();
    this.isPausedNow = false;
  }

  private run(countdown: Countdown): void {
    countdown.startedAt = this.now();
    countdown.handle = setTimeout(countdown.onExpire, countdown.remainingMs);
  }

  private sync(): void {
    const isHeld = this.holds.size > 0;
    if (isHeld === this.isPausedNow) return;
    this.isPausedNow = isHeld;
    const now = this.now();
    this.countdowns.forEach((countdown) => {
      if (!isHeld) {
        this.run(countdown);
        return;
      }
      clearTimeout(countdown.handle);
      countdown.handle = undefined;
      countdown.remainingMs = remainingAfter(
        countdown.remainingMs,
        countdown.startedAt,
        now,
      );
    });
  }
}
