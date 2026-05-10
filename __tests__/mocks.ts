import { vi } from 'vitest';
import { MockCharacters, ManyCharacters } from './fixtures';

export const mockFetch = () => {
  vi.spyOn(window, 'fetch').mockResolvedValue({
    ok: true,
    headers: { get: () => 'application/json' },
    json: async () => MockCharacters,
  } as unknown as Response);
};

export const mockFetchManyCharacters = () => {
  vi.spyOn(window, 'fetch').mockResolvedValue({
    ok: true,
    headers: { get: () => 'application/json' },
    json: async () => ManyCharacters,
  } as unknown as Response);
};

export const mockFetchError = () => {
  vi.spyOn(window, 'fetch').mockResolvedValue(
    new Response('<html>Not found</html>', {
      status: 200,
      headers: { 'content-type': 'text/html' },
    }),
  );
};

export const infiniteFetch = () => {
  vi.spyOn(window, 'fetch').mockReturnValue(new Promise(() => {}));
};
