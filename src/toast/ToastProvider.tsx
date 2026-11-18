import type { JSX, ReactNode } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';
import { ToastViewport } from '@/src/components/ui/ToastViewport';
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

interface ToastContextValue extends ToastApi {
  /** Distance from the bottom edge, set by the screen layout (AppShell). */
  setBottomOffset: (offset: number | null) => void;
}

const toastContext = createContext<ToastContextValue | null>(null);

/**
 * Holds the toasts of the whole app and draws them above every screen,
 * modals included. Each toast leaves after 5 seconds; a 4th one pushes the
 * oldest out. Hovering a toast, or focusing its action, pauses them all, so
 * the stack never moves under the pointer. Mounted once, in the root layout.
 */
export function ToastProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [bottomOffset, setBottomOffset] = useState<number | null>(null);
  const [timers] = useState(() => new ToastTimers());
  // Mirrors timers.isPaused, to redraw the countdown bars.
  const [isPaused, setIsPaused] = useState(false);
  // Mirrors `toasts` so timers and quick successive calls see the latest list.
  const toastsRef = useRef<Toast[]>([]);
  const nextIdRef = useRef(0);

  const update = (next: Toast[]): void => {
    droppedToastIds(toastsRef.current, next).forEach((id) => timers.forget(id));
    toastsRef.current = next;
    setToasts(next);
    setIsPaused(timers.isPaused);
  };

  const dismiss = (id: string): void =>
    update(removeToast(toastsRef.current, id));

  const show = (
    kind: Toast['kind'],
    message: string,
    action?: ToastAction,
  ): string => {
    nextIdRef.current += 1;
    const id = `toast-${nextIdRef.current}`;
    update(addToast(toastsRef.current, { id, kind, message, action }));
    timers.start(id, () => dismiss(id));
    // The web reads the role="status" region; Android its live region.
    if (Platform.OS === 'ios') {
      AccessibilityInfo.announceForAccessibility(message);
    }
    return id;
  };

  const hold = (id: string, reason: ToastHold): void => {
    timers.hold(id, reason);
    setIsPaused(timers.isPaused);
  };

  const release = (id: string, reason: ToastHold): void => {
    timers.release(id, reason);
    setIsPaused(timers.isPaused);
  };

  useEffect(() => (): void => timers.clear(), [timers]);

  const value: ToastContextValue = {
    success: (message, action) => show('success', message, action),
    error: (message, action) => show('error', message, action),
    dismiss,
    setBottomOffset,
  };

  return (
    <toastContext.Provider value={value}>
      {children}
      <ToastViewport
        toasts={toasts}
        bottomOffset={bottomOffset}
        isPaused={isPaused}
        onHold={hold}
        onRelease={release}
        onAction={(toast): void => {
          dismiss(toast.id);
          toast.action?.onPress();
        }}
      />
    </toastContext.Provider>
  );
}

const useToastContext = (): ToastContextValue => {
  const context = useContext(toastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context;
};

/** Shows toasts from any component: `toast.success(t('…'), action)`. */
export const useToast = (): ToastApi => {
  const { success, error, dismiss } = useToastContext();
  return { success, error, dismiss };
};

/**
 * Keeps toasts above the layout's bottom bars (bottom nav, "+" button) while
 * the calling layout is mounted. Without it, toasts sit near the bottom edge.
 */
export const useToastBottomOffset = (offset: number): void => {
  const { setBottomOffset } = useToastContext();
  useEffect(() => {
    setBottomOffset(offset);
    return (): void => setBottomOffset(null);
  }, [offset, setBottomOffset]);
};
