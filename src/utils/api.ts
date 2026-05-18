import type { TCharacter, TCharacterResponse } from './types';

const checkResponse = async (response: Response) => {
  if (response.ok) {
    return response.json();
  }
  return Promise.reject(response);
};

const baseURL = 'https://rickandmortyapi.com/api';

const _cacheName = 'rick-and-morty-cache';

const _getFromCache = async (url: string): Promise<Response | undefined> => {
  const cache = await caches.open(_cacheName);
  const cachedResponse = await cache.match(url);
  return cachedResponse;
};

const _addToCache = async (url: string, response: Response): Promise<void> => {
  const cache = await caches.open(_cacheName);
  await cache.put(url, response.clone());
};

export const getCharacters = async (page: number, name?: string): Promise<TCharacterResponse> => {
  const url = new URL(`${baseURL}/character`);
  if (name) {
    url.searchParams.set('name', name);
  }
  url.searchParams.set('page', String(page));

  const cached = await _getFromCache(url.toString());
  if (cached) {
    return cached.json();
  }

  const response = await fetch(url);
  const data = await checkResponse(response.clone());

  await _addToCache(url.toString(), response);

  return data;
};

export const getDetails = async (detailsId: number): Promise<TCharacter> => {
  const url = `${baseURL}/character/${detailsId}`;

  const cached = await _getFromCache(url);
  if (cached) {
    return cached.json();
  }

  const response = await fetch(url);
  const data = await checkResponse(response.clone());

  await _addToCache(url, response);

  return data;
};
