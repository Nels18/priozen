import { describe, expect, it, vi } from 'vitest';
import { MutationObserver } from '@tanstack/react-query';
import {
  createQueryClient,
  subscribeToMutationErrors,
  UNKEYED_MUTATION,
} from './queryClient';

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

  it('reports every failed mutation once, with its key', async (): Promise<void> => {
    const onError = vi.fn();
    const queryClient = createQueryClient(onError);
    const failure = new Error('Boom');

    const observer = new MutationObserver(queryClient, {
      mutationKey: ['tasks', 'create'],
      mutationFn: (): Promise<never> => Promise.reject(failure),
    });
    await observer.mutate().catch((): void => undefined);

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(failure, ['tasks', 'create']);
  });

  it('reports a mutation without key under a generic key', async (): Promise<void> => {
    const onError = vi.fn();
    const queryClient = createQueryClient(onError);

    const observer = new MutationObserver(queryClient, {
      mutationFn: (): Promise<never> => Promise.reject(new Error('Boom')),
    });
    await observer.mutate().catch((): void => undefined);

    expect(onError).toHaveBeenCalledWith(expect.any(Error), UNKEYED_MUTATION);
  });

  it('keeps fetched data fresh for 30 seconds', (): void => {
    const queryClient = createQueryClient();

    expect(queryClient.getDefaultOptions().queries?.staleTime).toBe(30_000);
  });
});

describe('subscribeToMutationErrors', () => {
  it('reports each failed mutation once, and no failed query', async (): Promise<void> => {
    const queryClient = createQueryClient(vi.fn());
    const onError = vi.fn();
    const unsubscribe = subscribeToMutationErrors(queryClient, onError);
    const failure = new Error('Boom');

    await queryClient
      .query({
        queryKey: ['tasks', 'list'],
        queryFn: (): Promise<never> => Promise.reject(failure),
        retry: false,
      })
      .catch((): void => undefined);
    expect(onError).not.toHaveBeenCalled();

    const failing = new MutationObserver(queryClient, {
      mutationFn: (): Promise<never> => Promise.reject(failure),
    });
    await failing.mutate().catch((): void => undefined);
    const succeeding = new MutationObserver(queryClient, {
      mutationFn: (): Promise<string> => Promise.resolve('saved'),
    });
    await succeeding.mutate();

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(failure);

    unsubscribe();
    await failing.mutate().catch((): void => undefined);
    expect(onError).toHaveBeenCalledTimes(1);
  });
});
