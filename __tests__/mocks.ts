import { vi } from 'vitest';
import { MockCharacters, ManyCharacters } from './fixtures';
import * as api from '@utils/api';
import { ApiError } from '@utils/api-error';

export const mockApiGetCharacters = () => {
  vi.spyOn(api, 'getCharacters').mockImplementation(async (_page, name) => {
    const results = name
      ? MockCharacters.filter((c) =>
          c.name.toLowerCase().includes(name.toLowerCase()),
        )
      : MockCharacters;
    return {
      info: { count: results.length, pages: 1, next: null, prev: null },
      results,
    };
  });
};

export const mockApiGetManyCharacters = () => {
  vi.spyOn(api, 'getCharacters').mockResolvedValue({
    info: {
      count: ManyCharacters.length,
      pages: 2,
      next: 'https://rickandmortyapi.com/api/character?page=2',
      prev: null,
    },
    results: ManyCharacters,
  });
};

export const mockApiNotFound = () => {
  vi.spyOn(api, 'getCharacters').mockRejectedValue(
    new ApiError('Character not found', 404),
  );
};

export const mockApiServerError = () => {
  vi.spyOn(api, 'getCharacters').mockRejectedValue(
    new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    }),
  );
};

export const infiniteApi = () => {
  vi.spyOn(api, 'getCharacters').mockReturnValue(new Promise(() => {}));
};

export const mockApiRefreshCharacters = () => {
  return vi
    .spyOn(api, 'getCharacters')
    .mockResolvedValueOnce({
      info: {
        count: 1,
        pages: 1,
        next: null,
        prev: null,
      },
      results: [MockCharacters[0]],
    })
    .mockResolvedValueOnce({
      info: {
        count: 1,
        pages: 1,
        next: null,
        prev: null,
      },
      results: [MockCharacters[1]],
    });
};
