import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ToastTimers } from './toastTimers';

describe('ToastTimers', () => {
  let timers: ToastTimers;

  beforeEach((): void => {
    vi.useFakeTimers();
    timers = new ToastTimers((): number => Date.now());
  });

  afterEach((): void => {
    timers.clear();
    vi.useRealTimers();
  });

  it('expires a toast after 5 seconds', (): void => {
    const onExpire = vi.fn();
    timers.start('a', onExpire);

    vi.advanceTimersByTime(4999);
    expect(onExpire).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('pauses every toast while one is hovered, then resumes the time left', (): void => {
    const onExpireA = vi.fn();
    const onExpireB = vi.fn();
    timers.start('a', onExpireA);
    vi.advanceTimersByTime(2000);
    timers.start('b', onExpireB);

    timers.hold('b', 'hover');
    expect(timers.isPaused).toBe(true);
    vi.advanceTimersByTime(60_000);
    expect(onExpireA).not.toHaveBeenCalled();
    expect(onExpireB).not.toHaveBeenCalled();

    timers.release('b', 'hover');
    expect(timers.isPaused).toBe(false);
    vi.advanceTimersByTime(3000);
    expect(onExpireA).toHaveBeenCalledTimes(1);
    expect(onExpireB).not.toHaveBeenCalled();
    vi.advanceTimersByTime(2000);
    expect(onExpireB).toHaveBeenCalledTimes(1);
  });

  it('stays paused until the hover and the focus are both released', (): void => {
    timers.start('a', vi.fn());
    timers.hold('a', 'hover');
    timers.hold('a', 'focus');

    timers.release('a', 'hover');
    expect(timers.isPaused).toBe(true);
    timers.release('a', 'focus');
    expect(timers.isPaused).toBe(false);
  });

  it('makes a toast shown during a pause wait for the others', (): void => {
    timers.start('a', vi.fn());
    timers.hold('a', 'hover');
    const onExpire = vi.fn();
    timers.start('b', onExpire);

    vi.advanceTimersByTime(10_000);
    expect(onExpire).not.toHaveBeenCalled();
    timers.release('a', 'hover');
    vi.advanceTimersByTime(5000);
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('resumes when the hovered toast is removed (no "leave" event)', (): void => {
    const onExpire = vi.fn();
    timers.start('a', vi.fn());
    timers.start('b', onExpire);
    timers.hold('a', 'hover');

    timers.forget('a');
    expect(timers.isPaused).toBe(false);
    vi.advanceTimersByTime(5000);
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('ignores a hold on a toast already gone', (): void => {
    timers.hold('missing', 'focus');

    expect(timers.isPaused).toBe(false);
  });
});
