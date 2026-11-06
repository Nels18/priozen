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

  const body = parseJson(await response.text());

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

  // A success without a readable JSON body breaks the API contract: fail
  // loudly instead of handing `null` to callers expecting data.
  if (body === undefined && response.status !== 204) {
    throw new ApiError(response.status, 'Empty or invalid JSON response');
  }

  return body as T;
};

/** `undefined` for an empty or non-JSON body. */
const parseJson = (text: string): unknown => {
  if (!text) return undefined;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
};
