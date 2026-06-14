import type { Character } from '@utils/types';
import { create } from 'zustand';
import { getCharacters } from '@utils/api';
import { ApiError } from '@utils/api-error';

type ResultsState = {
  characters: Character[];
  totalPages: number;
  isLoading: boolean;
  errorCode: number | null;

  setLoading: () => void;
  fetchCharacters: (page: number, searchTerm?: string) => Promise<void>;
};

let latestRequestId = 0;

export const useResultsStore = create<ResultsState>()((set) => ({
  characters: [],
  totalPages: 0,
  isLoading: false,
  errorCode: null,

  setLoading: (): void => {
    set({
      isLoading: true,
      errorCode: null,
    });
  },

  fetchCharacters: async (page: number, searchTerm?: string): Promise<void> => {
    const requestId = latestRequestId + 1;
    latestRequestId = requestId;

    set({
      isLoading: true,
      errorCode: null,
    });

    try {
      const response = await getCharacters(page, searchTerm);

      if (requestId !== latestRequestId) {
        return;
      }

      set({
        isLoading: false,
        errorCode: null,
        characters: response.results,
        totalPages: response.info.pages,
      });
    } catch (error) {
      if (requestId !== latestRequestId) {
        return;
      }
      set({
        isLoading: false,
        errorCode: error instanceof ApiError ? error.status : null,
        totalPages: 0,
        characters: [],
      });
    }
  },
}));
