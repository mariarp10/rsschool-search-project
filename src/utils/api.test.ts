import { afterEach, describe, expect, test, vi } from 'vitest';

import { getCharacters, getDetails } from './api';
import { ApiError } from './api-error';
import { MockCharacters } from '@tests/fixtures';
import type { CharacterResponse } from './types';

const createCharactersResponse = (): CharacterResponse => ({
  info: {
    count: MockCharacters.length,
    pages: 1,
    next: null,
    prev: null,
  },
  results: MockCharacters,
});

describe('api', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  describe('getCharacters', () => {
    test('fetches characters by page', async () => {
      const responseData = createCharactersResponse();

      const fetchMock = vi.fn().mockResolvedValue(
        Response.json(responseData, {
          status: 200,
        }),
      );

      vi.stubGlobal('fetch', fetchMock);

      const result = await getCharacters(1);

      expect(result).toEqual(responseData);
      expect(fetchMock).toHaveBeenCalledTimes(1);

      const requestUrl = String(fetchMock.mock.calls[0]?.[0]);

      expect(requestUrl).toBe(
        'https://rickandmortyapi.com/api/character?page=1',
      );
    });

    test('fetches characters by page and name', async () => {
      const responseData = createCharactersResponse();

      const fetchMock = vi.fn().mockResolvedValue(
        Response.json(responseData, {
          status: 200,
        }),
      );

      vi.stubGlobal('fetch', fetchMock);

      await getCharacters(2, 'rick');

      expect(fetchMock).toHaveBeenCalledTimes(1);

      const requestUrl = String(fetchMock.mock.calls[0]?.[0]);

      expect(requestUrl).toBe(
        'https://rickandmortyapi.com/api/character?name=rick&page=2',
      );
    });

    test('throws ApiError when characters request fails', async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        Response.json(
          { error: 'Not found' },
          {
            status: 404,
          },
        ),
      );

      vi.stubGlobal('fetch', fetchMock);

      await expect(getCharacters(1, 'unknown')).rejects.toBeInstanceOf(
        ApiError,
      );

      await expect(getCharacters(1, 'unknown')).rejects.toMatchObject({
        message: 'Failed to fetch characters',
        status: 404,
      });
    });
  });

  describe('getDetails', () => {
    test('fetches character details by id', async () => {
      const character = MockCharacters[0];

      const fetchMock = vi.fn().mockResolvedValue(
        Response.json(character, {
          status: 200,
        }),
      );

      vi.stubGlobal('fetch', fetchMock);

      const result = await getDetails(character.id);

      expect(result).toEqual(character);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(
        `https://rickandmortyapi.com/api/character/${String(character.id)}`,
      );
    });

    test('throws ApiError when character details request fails', async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        Response.json(
          { error: 'Not found' },
          {
            status: 404,
          },
        ),
      );

      const nonExistentId = 999;

      vi.stubGlobal('fetch', fetchMock);

      await expect(getDetails(nonExistentId)).rejects.toBeInstanceOf(ApiError);

      await expect(getDetails(nonExistentId)).rejects.toMatchObject({
        message: 'Failed to fetch character details',
        status: 404,
      });
    });
  });
});
