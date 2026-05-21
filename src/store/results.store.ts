import type { TCharacter } from '@utils/types';
import { create } from 'zustand';
import { getCharacters } from '@utils/api';
import { getStatusCode } from '@utils/helpers';

type TResultsState = {
  characters: TCharacter[];
  totalPages: number;
  isLoading: boolean;
  errorCode: number | null;

  setLoading: () => void;
  fetchCharacters: (page: number, searchTerm?: string) => Promise<void>;
};

export const useResultsStore = create<TResultsState>()((set) => ({
  characters: [],
  totalPages: 0,
  isLoading: false,
  errorCode: null,

  setLoading: () => {
    set({
      isLoading: true,
      errorCode: null,
    });
  },

  fetchCharacters: async (page: number, searchTerm?: string) => {
    set({
      isLoading: true,
      errorCode: null,
    });

    try {
      const response = await getCharacters(page, searchTerm);

      set({
        isLoading: false,
        errorCode: null,
        characters: response.results,
        totalPages: response.info.pages,
      });
    } catch (err) {
      set({
        isLoading: false,
        errorCode: getStatusCode(err),
        totalPages: 0,
        characters: [],
      });
    }
  },
}));
