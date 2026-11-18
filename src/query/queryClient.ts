import type { Mutation, Query, QueryKey } from '@tanstack/react-query';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

/** Receives every failed query or mutation once, with its key. */
export type QueryErrorHandler = (error: Error, key: QueryKey) => void;

/** Key reported for a mutation declared without `mutationKey`. */
export const UNKEYED_MUTATION = ['mutation'] as const;

/**
 * How long fetched data counts as fresh. Fresh data is reused as-is; stale
 * data is refetched on mount, when the app comes back to the foreground and
 * when the network comes back (see QueryProvider).
 */
export const QUERY_STALE_TIME_MS = 30 * 1000;

/** Retries after a failed request: 3 attempts in total. */
export const QUERY_RETRY_COUNT = 2;

/** Default handler: failures are logged, for debugging. */
const logQueryError: QueryErrorHandler = (error, key) => {
  // eslint-disable-next-line no-console
  console.error('[query] request failed', key, error);
};

/**
 * The app's single QueryClient. Query and mutation errors are reported
 * once, here, instead of in every screen; screens still render their own
 * error state (`isError`, a rejected `mutateAsync`).
 */
export const createQueryClient = (
  onError: QueryErrorHandler = logQueryError,
): QueryClient =>
  new QueryClient({
    queryCache: new QueryCache({
      onError: (error: Error, query: Query<unknown, unknown, unknown>): void =>
        onError(error, query.queryKey),
    }),
    mutationCache: new MutationCache({
      onError: (
        error: Error,
        _variables: unknown,
        _context: unknown,
        mutation: Mutation<unknown, unknown, unknown, unknown>,
      ): void =>
        onError(error, mutation.options.mutationKey ?? UNKEYED_MUTATION),
    }),
    defaultOptions: {
      queries: {
        staleTime: QUERY_STALE_TIME_MS,
        retry: QUERY_RETRY_COUNT,
      },
    },
  });

/**
 * Calls `onError` once per failed mutation (a save), never for a failed
 * query: a read keeps the error state of its screen. The app shows an error
 * toast this way (UX-02). Returns the unsubscribe function.
 */
export const subscribeToMutationErrors = (
  queryClient: QueryClient,
  onError: (error: unknown) => void,
): (() => void) =>
  queryClient.getMutationCache().subscribe((event) => {
    if (event.type === 'updated' && event.action.type === 'error') {
      onError(event.action.error);
    }
  });
