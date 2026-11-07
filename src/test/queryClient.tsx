import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { JSX, ReactNode } from 'react';

/**
 * QueryClient for tests: no retries (a failing request fails at once) and
 * no garbage collection timer keeping the test process alive.
 */
export const createTestQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  });

/** Wrapper for rendering hooks or components that use TanStack Query. */
export const createQueryWrapper = (
  queryClient: QueryClient = createTestQueryClient(),
): (({ children }: { children: ReactNode }) => JSX.Element) =>
  function QueryWrapper({ children }: { children: ReactNode }): JSX.Element {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
