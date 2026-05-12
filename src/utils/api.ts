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
  _cache: Map<string, TCharacterResponse> = new Map();

  constructor(url: string) {
    this._url = url;
  }

  private _cacheKey(page: number, name?: string): string {
    return name ? `?name=${name}&page=${page}` : `?page=${page}`;
  }

  async getCharacters(page: number, name?: string): Promise<TCharacterResponse> {
    const key = this._cacheKey(page, name);

    const url = new URL(`${this._url}/character`);
    if (name) {
      url.searchParams.set('name', name);
    }
    url.searchParams.set('page', String(page));

    if (this._cache.has(key)) {
      return this._cache.get(key);
    }

    const response = await fetch(url);
    const data = await checkResponse(response);

    this._cache.set(key, data);
    return data;
  }
}

const api = new Api(baseURL);

export default api;
