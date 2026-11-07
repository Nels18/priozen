import { describe, expect, it, vi } from 'vitest';
import { createQueryClient } from './queryClient';

describe('createQueryClient', () => {
  it('reports every failed query once, with its key', async (): Promise<void> => {
    const onError = vi.fn();
    const queryClient = createQueryClient(onError);
    const failure = new Error('Boom');

    await queryClient
      .query({
        queryKey: ['tasks', 'list'],
        queryFn: (): Promise<never> => Promise.reject(failure),
        retry: false,
      })
      .catch((): void => undefined);

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(failure, ['tasks', 'list']);
  });

  it('keeps fetched data fresh for 30 seconds', (): void => {
    const queryClient = createQueryClient();

    expect(queryClient.getDefaultOptions().queries?.staleTime).toBe(30_000);
  });
});
