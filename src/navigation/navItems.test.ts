import { describe, expect, it } from 'vitest';
import { getActiveNavItem } from './navItems';

describe('getActiveNavItem', () => {
  it.each([
    ['/', 'tasks'],
    ['/folders', 'folders'],
    ['/folders/folder-1', 'folders'],
    ['/focus', 'focus'],
    ['/analytics', 'analytics'],
    ['/profile', 'profile'],
    ['/unknown', 'tasks'],
  ])('maps %s to %s', (pathname: string, expected: string): void => {
    expect(getActiveNavItem(pathname).key).toBe(expected);
  });

  it('does not match a path that only shares a prefix', (): void => {
    expect(getActiveNavItem('/focused').key).toBe('tasks');
  });
});
