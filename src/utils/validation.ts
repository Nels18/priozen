// Deliberately permissive: catches typos (missing @, domain or TLD) without
// rejecting valid but unusual addresses — the backend stays the authority.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (value: string): boolean =>
  EMAIL_PATTERN.test(value.trim());
