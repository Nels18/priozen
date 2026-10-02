import { ApiError } from '../api/client';
import { isValidEmail } from '../utils/validation';

// Functions return translation keys of the "auth" namespace (not text) so
// they stay pure and the screen picks the language at render time.
export type LoginErrorKey =
  | 'errors.emailRequired'
  | 'errors.emailInvalid'
  | 'errors.passwordRequired'
  | 'errors.invalidCredentials'
  | 'errors.generic';

export interface LoginFieldErrors {
  email?: LoginErrorKey;
  password?: LoginErrorKey;
}

/** Client-side checks run before calling the API. Empty object = valid. */
export const validateLoginForm = (
  email: string,
  password: string,
): LoginFieldErrors => {
  const errors: LoginFieldErrors = {};
  if (!email.trim()) errors.email = 'errors.emailRequired';
  else if (!isValidEmail(email)) errors.email = 'errors.emailInvalid';
  if (!password) errors.password = 'errors.passwordRequired';
  return errors;
};

export const getLoginErrorKey = (error: unknown): LoginErrorKey =>
  error instanceof ApiError && error.status === 401
    ? 'errors.invalidCredentials'
    : 'errors.generic';
