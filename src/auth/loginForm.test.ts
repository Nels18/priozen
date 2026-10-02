import { describe, expect, it } from 'vitest';
import { ApiError } from '../api/client';
import { getLoginErrorKey, validateLoginForm } from './loginForm';

describe('validateLoginForm', () => {
  it('returns no error for a valid email and a password', (): void => {
    expect(validateLoginForm('martin@priozen.app', 'secret')).toEqual({});
  });

  it('flags missing fields', (): void => {
    expect(validateLoginForm('  ', '')).toEqual({
      email: 'errors.emailRequired',
      password: 'errors.passwordRequired',
    });
  });

  it('flags a malformed email', (): void => {
    expect(validateLoginForm('martin@', 'secret')).toEqual({
      email: 'errors.emailInvalid',
    });
  });
});

describe('getLoginErrorKey', () => {
  it('explains invalid credentials on a 401', (): void => {
    expect(getLoginErrorKey(new ApiError(401, 'Invalid credentials.'))).toBe(
      'errors.invalidCredentials',
    );
  });

  it('falls back to a generic error otherwise', (): void => {
    expect(getLoginErrorKey(new ApiError(500, 'Boom'))).toBe('errors.generic');
    expect(getLoginErrorKey(new TypeError('Network request failed'))).toBe(
      'errors.generic',
    );
  });
});
