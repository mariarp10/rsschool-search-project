import type { Character, CharacterResponse } from './types';
import { ApiError } from './api-error';

const baseURL = 'https://rickandmortyapi.com/api';

const cacheName = 'rick-and-morty-cache';

const getFromCache = async (url: string): Promise<Response | undefined> => {
  const cache: Cache = await caches.open(cacheName);
  const cachedResponse: Response | undefined = await cache.match(url);

  return cachedResponse;
};

const addToCache = async (url: string, response: Response): Promise<void> => {
  const cache: Cache = await caches.open(cacheName);

  await cache.put(url, response.clone());
};

export const getCharacters = async (
  page: number,
  name?: string
): Promise<CharacterResponse> => {
  const url: URL = new URL(`${baseURL}/character`);

  if (name) {
    url.searchParams.set('name', name);
  }

  url.searchParams.set('page', String(page));

  const urlString: string = url.toString();

  const cached: Response | undefined = await getFromCache(urlString);

  if (cached) {
    const data: CharacterResponse = await cached.json();
    return data;
  }

  const response: Response = await fetch(urlString);

  if (!response.ok) {
    throw new ApiError('Failed to fetch characters', response.status);
  }

  const data: CharacterResponse = await response.clone().json();

  await addToCache(urlString, response);

  return data;
};

export const getDetails = async (detailsId: number): Promise<Character> => {
  const url: string = `${baseURL}/character/${String(detailsId)}`;

  const cached: Response | undefined = await getFromCache(url);

  if (cached) {
    const data: Character = await cached.json();
    return data;
  }

  const response: Response = await fetch(url);

  if (!response.ok) {
    throw new ApiError('Failed to fetch character details', response.status);
  }

  const data: Character = await response.clone().json();

  await addToCache(url, response);

  return data;
};
