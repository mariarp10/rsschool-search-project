import type { TCharacterResponse } from './types';

const checkResponse = async (response: Response) => {
  if (response.ok) {
    return response.json();
  }
  return Promise.reject(response);
};

const baseURL = 'https://rickandmortyapi.com/api';

class Api {
  _url: string;
  _cacheName = 'rick-and-morty-cache';

  constructor(url: string) {
    this._url = url;
  }

  private async _getFromCache(url: string): Promise<Response | undefined> {
    const cache = await caches.open(this._cacheName);
    const cachedResponse = await cache.match(url);
    return cachedResponse;
  }

  private async _addToCache(url: string, response: Response): Promise<void> {
    const cache = await caches.open(this._cacheName);
    await cache.put(url, response.clone());
  }

  async getCharacters(page: number, name?: string): Promise<TCharacterResponse> {
    const url = new URL(`${this._url}/character`);
    if (name) {
      url.searchParams.set('name', name);
    }
    url.searchParams.set('page', String(page));

    const cached = await this._getFromCache(url.toString());
    if (cached) {
      return cached.json();
    }

    const response = await fetch(url);
    const data = await checkResponse(response.clone());

    await this._addToCache(url.toString(), response);

    return data;
  }
}

const api = new Api(baseURL);

export default api;
