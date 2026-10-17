// Thin fetch wrapper shared by every API module. The base URL always comes
// from EXPO_PUBLIC_API_URL (never hardcoded); MSW handlers match any host, so
// the same calls hit the mocks today and the real backend later.

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const getBaseUrl = (): string => process.env.EXPO_PUBLIC_API_URL ?? '';

export const apiRequest = async <T>(
  path: string,
  init: RequestInit = {},
): Promise<T> => {
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${getBaseUrl()}${path}`, { ...init, headers });

  const body = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    const message =
      typeof body === 'object' &&
      body !== null &&
      'message' in body &&
      typeof body.message === 'string'
        ? body.message
        : `Request failed with status ${response.status}`;
    throw new ApiError(response.status, message);
  }

  return body as T;
};
