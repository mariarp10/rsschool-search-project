import type { TCharacterResponse } from './types';

const checkResponse = async (response: Response) => {
  if (response.ok) {
    return response.json();
  }
  return Promise.reject(response.status);
};

const baseURL = 'https://rickandmortyapi.com/api';

class Api {
  _url: string;

  constructor(url: string) {
    this._url = url;
  }

  async getAllCharacters(page: number): Promise<TCharacterResponse> {
    const urlWithPagination = new URL(`${this._url}/character`);
    urlWithPagination.searchParams.set('page', String(page));

    const response = await fetch(urlWithPagination);
    return checkResponse(response);
  }
}

const api = new Api(baseURL);

export default api;
