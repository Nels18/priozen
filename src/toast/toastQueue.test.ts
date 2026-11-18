import { describe, expect, it } from 'vitest';
import type { Toast } from './toastQueue';
import {
  addToast,
  droppedToastIds,
  MAX_TOASTS,
  remainingAfter,
  removeToast,
  TOAST_DURATION_MS,
} from './toastQueue';

const toast = (id: string): Toast => ({
  id,
  kind: 'success',
  message: `Toast ${id}`,
});

describe('toast queue', () => {
  it('shows 3 toasts for 5 seconds', (): void => {
    expect(MAX_TOASTS).toBe(3);
    expect(TOAST_DURATION_MS).toBe(5000);
  });

  it('adds new toasts at the end', (): void => {
    expect(addToast([toast('a')], toast('b')).map((t) => t.id)).toEqual([
      'a',
      'b',
    ]);
  });

  it('never keeps more than 3: the 4th pushes the oldest out', (): void => {
    let toasts: Toast[] = [];
    ['a', 'b', 'c', 'd', 'e'].forEach((id) => {
      toasts = addToast(toasts, toast(id));
    });

    expect(toasts.map((t) => t.id)).toEqual(['c', 'd', 'e']);
  });

  it('removes one toast and keeps the others in order', (): void => {
    const toasts = [toast('a'), toast('b'), toast('c')];

    expect(removeToast(toasts, 'b').map((t) => t.id)).toEqual(['a', 'c']);
    expect(removeToast(toasts, 'missing')).toEqual(toasts);
  });

  it('lists the toasts pushed out, to clear their timers', (): void => {
    const previous = [toast('a'), toast('b'), toast('c')];
    const next = addToast(previous, toast('d'));

    expect(droppedToastIds(previous, next)).toEqual(['a']);
    expect(droppedToastIds(next, next)).toEqual([]);
  });
});

describe('remainingAfter', () => {
  it('takes the elapsed time off the countdown', (): void => {
    expect(remainingAfter(5000, 1000, 3000)).toBe(3000);
    expect(remainingAfter(3000, 10_000, 10_000)).toBe(3000);
  });

  it('never goes below zero', (): void => {
    expect(remainingAfter(5000, 0, 8000)).toBe(0);
  });
});
