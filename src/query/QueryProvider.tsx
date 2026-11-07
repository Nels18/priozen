import {
  focusManager,
  onlineManager,
  QueryClientProvider,
} from '@tanstack/react-query';
import { addNetworkStateListener, getNetworkStateAsync } from 'expo-network';
import type { JSX, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import type { AppStateStatus } from 'react-native';
import { AppState, Platform } from 'react-native';
import { createQueryClient } from './queryClient';

/**
 * On iOS / Android, tell TanStack Query when the app is in the foreground
 * and when the network is up, so stale queries refetch at those moments.
 * The web needs nothing: TanStack Query already listens to the browser's
 * `visibilitychange` and `online` / `offline` events.
 */
const useNativeQueryManagers = (): void => {
  useEffect(() => {
    if (Platform.OS === 'web') return;

    const appStateSubscription = AppState.addEventListener(
      'change',
      (status: AppStateStatus): void => {
        focusManager.setFocused(status === 'active');
      },
    );

    onlineManager.setEventListener((setOnline) => {
      // The listener only reports changes: also read the current state, so an
      // app started offline pauses its queries instead of failing and retrying.
      void getNetworkStateAsync().then((state): void => {
        setOnline(state.isConnected ?? true);
      });
      const networkSubscription = addNetworkStateListener((state): void => {
        setOnline(state.isConnected ?? true);
      });
      return (): void => networkSubscription.remove();
    });

    return (): void => {
      appStateSubscription.remove();
      // Replacing the listener runs the previous cleanup (network subscription).
      onlineManager.setEventListener(() => undefined);
    };
  }, []);
};

/** Provides the app's QueryClient, created once for the app's lifetime. */
export function QueryProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [queryClient] = useState(createQueryClient);
  useNativeQueryManagers();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
