import type { JSX, ReactNode } from 'react';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from 'react';
import { AccessibilityInfo, Platform } from 'react-native';
import { ToastViewport } from '@/src/components/ui/ToastViewport';
import type { ToastApi } from './toastStore';
import { ToastStore } from './toastStore';

export type { ToastApi } from './toastStore';

// The store never changes: consumers never rerender because of it.
const toastContext = createContext<ToastStore | null>(null);

// The web reads the role="status" region; Android its live region.
const announce = (message: string): void => {
  if (Platform.OS === 'ios') {
    AccessibilityInfo.announceForAccessibility(message);
  }
};

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
  const [store] = useState(() => new ToastStore(announce));
  const { toasts, isPaused, bottomOffset } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );

  useEffect(() => (): void => store.clear(), [store]);

  return (
    <toastContext.Provider value={store}>
      {children}
      <ToastViewport
        toasts={toasts}
        bottomOffset={bottomOffset}
        isPaused={isPaused}
        onHold={store.hold}
        onRelease={store.release}
        onAction={store.runAction}
      />
    </toastContext.Provider>
  );
}

const useToastStore = (): ToastStore => {
  const store = useContext(toastContext);
  if (!store) throw new Error('useToast must be used inside ToastProvider');
  return store;
};

/**
 * Shows toasts from any component: `toast.success(t('…'), action)`. The
 * functions are the same on every render: safe in effect dependencies.
 */
export const useToast = (): ToastApi => useToastStore().api;

/**
 * Keeps toasts above the layout's bottom bars (bottom nav, "+" button) while
 * the calling layout is mounted. Without it, toasts sit near the bottom edge.
 */
export const useToastBottomOffset = (offset: number): void => {
  const { setBottomOffset } = useToastStore();
  useEffect(() => {
    setBottomOffset(offset);
    return (): void => setBottomOffset(null);
  }, [offset, setBottomOffset]);
};
