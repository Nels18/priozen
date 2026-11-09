import { matchRequestUrl } from 'msw';
import { describe, expect, it } from 'vitest';
import { tasksRoutes } from '../api/routes';
import { TEST_API_URL } from '../test/constants';
import { apiPattern, createId, randomDelay } from './utils';

describe('createId', () => {
  it('prefixes the generated id with the given prefix', () => {
    const id: string = createId('task');
    expect(id.startsWith('task-')).toBe(true);
  });

  it('matches the expected "<prefix>-<timestamp>-<random>" shape', () => {
    const id: string = createId('folder');
    expect(id).toMatch(/^folder-\d+-[a-z0-9]{5}$/);
  });

  it('generates unique ids on successive calls', () => {
    const first: string = createId('user');
    const second: string = createId('user');
    expect(first).not.toBe(second);
  });
});

describe('randomDelay', () => {
  it('resolves once the delay has elapsed', async () => {
    await expect(randomDelay(0, 1)).resolves.toBeUndefined();
  });
});

describe('apiPattern', () => {
  const detailPattern = apiPattern(tasksRoutes.detail(':id'));

  it('matches requests to the API host', (): void => {
    expect(
      matchRequestUrl(new URL(`${TEST_API_URL}/tasks/task-1`), detailPattern)
        .matches,
    ).toBe(true);
  });

  it("ignores the app's own files, such as a lazy route bundle", (): void => {
    const bundle = new URL(
      'http://localhost:8081/app/(protected)/tasks/new.bundle?platform=web',
    );
    expect(matchRequestUrl(bundle, detailPattern).matches).toBe(false);
  });
});
