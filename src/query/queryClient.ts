import type { Query, QueryKey } from '@tanstack/react-query';
import { QueryCache, QueryClient } from '@tanstack/react-query';

export type QueryErrorHandler = (error: Error, queryKey: QueryKey) => void;

/**
 * How long fetched data counts as fresh. Fresh data is reused as-is; stale
 * data is refetched on mount, when the app comes back to the foreground and
 * when the network comes back (see QueryProvider).
 */
export const QUERY_STALE_TIME_MS = 30 * 1000;

/** Retries after a failed request: 3 attempts in total. */
export const QUERY_RETRY_COUNT = 2;

/** Default handler: no toast system yet (UX-02), so failures are logged. */
const logQueryError: QueryErrorHandler = (error, queryKey) => {
  // eslint-disable-next-line no-console
  console.error('[query] request failed', queryKey, error);
};

/**
 * The app's single QueryClient. Query errors are reported once, here,
 * instead of in every screen; screens still read `isError` to render
 * their own error state.
 */
export const createQueryClient = (
  onError: QueryErrorHandler = logQueryError,
): QueryClient =>
  new QueryClient({
    queryCache: new QueryCache({
      onError: (error: Error, query: Query<unknown, unknown, unknown>): void =>
        onError(error, query.queryKey),
    }),
    defaultOptions: {
      queries: {
        staleTime: QUERY_STALE_TIME_MS,
        retry: QUERY_RETRY_COUNT,
      },
    },
  });
