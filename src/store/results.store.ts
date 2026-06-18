import type { Character } from '@utils/types';
import { create } from 'zustand';

type ResultsState = {
  characters: Character[];
  totalPages: number;
  isLoading: boolean;
  errorCode: number | null;

  setLoading: () => void;
  setResults: (characters: Character[], totalPages: number) => void;
  setError: (errorCode: number | null) => void;
};

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

  setResults: (characters, totalPages): void => {
    set({
      characters,
      totalPages,
      isLoading: false,
      errorCode: null,
    });
  },

  setError: (errorCode): void => {
    set({
      characters: [],
      totalPages: 0,
      isLoading: false,
      errorCode,
    });
  },
}));
