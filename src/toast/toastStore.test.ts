import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ToastStore } from './toastStore';

describe('ToastStore', () => {
  let store: ToastStore;
  let announce: ReturnType<typeof vi.fn<(message: string) => void>>;

  const messages = (): string[] =>
    store.getSnapshot().toasts.map((toast) => toast.message);

  beforeEach((): void => {
    vi.useFakeTimers();
    announce = vi.fn<(message: string) => void>();
    store = new ToastStore(announce, (): number => Date.now());
  });

  afterEach((): void => {
    store.clear();
    vi.useRealTimers();
  });

  it('hands out the same functions forever, for effect dependencies', (): void => {
    const { api } = store;
    store.api.success('Terminée : A');

    expect(store.api).toBe(api);
    expect(store.api.error).toBe(api.error);
  });

  it('shows, announces and removes a toast after 5 seconds', (): void => {
    const listener = vi.fn();
    store.subscribe(listener);

    const id = store.api.success('Terminée : A');
    expect(store.getSnapshot().toasts).toEqual([
      { id, kind: 'success', message: 'Terminée : A', action: undefined },
    ]);
    expect(announce).toHaveBeenCalledWith('Terminée : A');
    expect(listener).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(5000);
    expect(messages()).toEqual([]);
  });

  it('keeps 3 toasts at most, and forgets the countdown of the one pushed out', (): void => {
    ['A', 'B', 'C', 'D'].forEach((name) => store.api.success(name));

    expect(messages()).toEqual(['B', 'C', 'D']);
    vi.advanceTimersByTime(5000);
    expect(messages()).toEqual([]);
  });

  it('dismisses a toast early, and runs its action after removing it', (): void => {
    const onPress = vi.fn();
    store.api.success('A', { label: 'Annuler', onPress });
    const id = store.api.error('B');

    store.api.dismiss(id);
    expect(messages()).toEqual(['A']);

    store.runAction(store.getSnapshot().toasts[0]);
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(messages()).toEqual([]);
  });

  it('pauses while a toast is held, and resumes when it leaves', (): void => {
    const id = store.api.success('A');
    store.hold(id, 'hover');
    expect(store.getSnapshot().isPaused).toBe(true);

    vi.advanceTimersByTime(10_000);
    expect(messages()).toEqual(['A']);

    store.api.dismiss(id);
    expect(store.getSnapshot().isPaused).toBe(false);
  });

  it('keeps the same snapshot when nothing changes', (): void => {
    store.setBottomOffset(120);
    const snapshot = store.getSnapshot();

    store.setBottomOffset(120);
    store.release('missing', 'hover');
    expect(store.getSnapshot()).toBe(snapshot);
    expect(snapshot.bottomOffset).toBe(120);
  });
});
