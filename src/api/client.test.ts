import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { TEST_API_URL } from '../test/constants';
import { ApiError, apiRequest } from './client';

const server = setupServer();

beforeAll((): void => {
  vi.stubEnv('EXPO_PUBLIC_API_URL', TEST_API_URL);
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach((): void => {
  server.resetHandlers();
});

afterAll((): void => {
  server.close();
  vi.unstubAllEnvs();
});

describe('apiRequest', () => {
  it('returns the parsed JSON body of a success', async (): Promise<void> => {
    server.use(
      http.get(`${TEST_API_URL}/ping`, () => HttpResponse.json({ ok: 1 })),
    );

    await expect(apiRequest('/ping')).resolves.toEqual({ ok: 1 });
  });

  it('throws an ApiError with the server message on failure', async (): Promise<void> => {
    server.use(
      http.get(`${TEST_API_URL}/ping`, () =>
        HttpResponse.json({ message: 'Nope.' }, { status: 403 }),
      ),
    );

    await expect(apiRequest('/ping')).rejects.toMatchObject({
      status: 403,
      message: 'Nope.',
    });
  });

  it('throws instead of returning null for a success without JSON body', async (): Promise<void> => {
    server.use(
      http.get(
        `${TEST_API_URL}/ping`,
        () => new HttpResponse(null, { status: 200 }),
      ),
    );

    await expect(apiRequest('/ping')).rejects.toBeInstanceOf(ApiError);
  });

  it('accepts an empty body for 204 No Content', async (): Promise<void> => {
    server.use(
      http.get(
        `${TEST_API_URL}/ping`,
        () => new HttpResponse(null, { status: 204 }),
      ),
    );

    await expect(apiRequest('/ping')).resolves.toBeUndefined();
  });
});
