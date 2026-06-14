import { vi } from 'vitest';
import { MockCharacters, ManyCharacters } from './fixtures';
import * as api from '@utils/api';
import { ApiError } from '@utils/api-error';

export const mockApiGetCharacters = (): void => {
  vi.spyOn(api, 'getCharacters').mockImplementation((_page, name) => {
    const results = name
      ? MockCharacters.filter((c) =>
          c.name.toLowerCase().includes(name.toLowerCase()),
        )
      : MockCharacters;
    return Promise.resolve({
      info: { count: results.length, pages: 1, next: null, prev: null },
      results,
    });
  });
};

export const mockApiGetManyCharacters = (): void => {
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

export const mockApiNotFound = (): void => {
  const notFoundCode = 404;

  vi.spyOn(api, 'getCharacters').mockRejectedValue(
    new ApiError('Not Found', notFoundCode),
  );
};

export const mockApiServerError = (): void => {
  const serverErrorCode = 500;

  vi.spyOn(api, 'getCharacters').mockRejectedValue(
    new ApiError('Internal Server Error', serverErrorCode),
  );
};

export const infiniteApi = (): void => {
  vi.spyOn(api, 'getCharacters').mockReturnValue(
    new Promise(() => {
      // noop
    }),
  );
};
