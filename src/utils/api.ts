import type { TCharacter, TCharacterResponse } from './types';
import { CharacterResponseSchema, CharacterSchema } from './api.schemas';
import { ApiError } from './api-error';

const baseURL = 'https://rickandmortyapi.com/api';

export const getCharacters = async (
  page: number,
  name?: string,
): Promise<TCharacterResponse> => {
  const url: URL = new URL(`${baseURL}/character`);

  if (name) {
    url.searchParams.set('name', name);
  }

  url.searchParams.set('page', String(page));

  const urlString: string = url.toString();

  const response: Response = await fetch(urlString);

  if (!response.ok) {
    throw new ApiError('Failed to fetch characters', response.status);
  }

  const data: unknown = await response.json();

  return CharacterResponseSchema.parse(data);
};

export const getDetails = async (detailsId: number): Promise<TCharacter> => {
  const url: URL = new URL(`${baseURL}/character/${String(detailsId)}`);

  const response: Response = await fetch(url);

  if (!response.ok) {
    throw new ApiError('Failed to fetch character details', response.status);
  }

  const data: unknown = await response.json();

  return CharacterSchema.parse(data);
};
