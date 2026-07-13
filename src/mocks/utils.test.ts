import { describe, expect, it } from 'vitest';
import { createId, randomDelay } from './utils';

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
