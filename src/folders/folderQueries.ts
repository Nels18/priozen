import { queryOptions } from '@tanstack/react-query';
import { listFolders } from '../api/folders';

/** Query keys and options for folders (same pattern as `taskQueries`). */
export const folderKeys = {
  all: ['folders'] as const,
  list: () => [...folderKeys.all, 'list'] as const,
};

export const folderQueries = {
  /** The user's folders. */
  // Return type left inferred on purpose: it carries the key ↔ data typing.
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
  list: () =>
    queryOptions({
      queryKey: folderKeys.list(),
      queryFn: listFolders,
    }),
};
