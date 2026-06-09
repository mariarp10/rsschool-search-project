import type { Character } from '@utils/types';

export type HomePageState = {
  searchValue: string;
  lastSearch: string;
  totalPages: number;
  charactersForPage: Character[];
  isLoading: boolean;
  hasError: boolean;
  errorCode: number | null;
};

export type HomePageAction =
  | { type: 'SET_SEARCH_VALUE'; payload: string }
  | { type: 'INIT_LAST_SEARCH'; payload: string }
  | { type: 'START_LOADING' }
  | {
      type: 'LOAD_SUCCESS';
      payload: {
        totalPages: number;
        charactersForPage: Character[];
      };
    }
  | {
      type: 'LOAD_ERROR';
      payload: {
        errorCode: number | null;
        shouldResetResults: boolean;
      };
    }
  | { type: 'SEARCH'; payload: string };

export const initialHomePageState: HomePageState = {
  searchValue: '',
  lastSearch: '',
  totalPages: 0,
  charactersForPage: [],
  isLoading: false,
  hasError: false,
  errorCode: null,
};

export function homePageReducer(
  state: HomePageState,
  action: HomePageAction,
): HomePageState {
  switch (action.type) {
    case 'SET_SEARCH_VALUE': {
      return {
        ...state,
        searchValue: action.payload,
      };
    }

    case 'INIT_LAST_SEARCH': {
      return {
        ...state,
        hasError: false,
        errorCode: null,
        searchValue: action.payload,
        lastSearch: action.payload,
      };
    }

    case 'START_LOADING': {
      return {
        ...state,
        hasError: false,
        isLoading: true,
        errorCode: null,
      };
    }

    case 'LOAD_SUCCESS': {
      return {
        ...state,
        totalPages: action.payload.totalPages,
        charactersForPage: action.payload.charactersForPage,
        hasError: false,
        isLoading: false,
        errorCode: null,
      };
    }

    case 'LOAD_ERROR': {
      return {
        ...state,
        isLoading: false,
        hasError: true,
        errorCode: action.payload.errorCode,
        charactersForPage: action.payload.shouldResetResults
          ? []
          : state.charactersForPage,
        totalPages: action.payload.shouldResetResults ? 0 : state.totalPages,
      };
    }

    case 'SEARCH': {
      return {
        ...state,
        searchValue: action.payload,
        lastSearch: action.payload,
        hasError: false,
        errorCode: null,
      };
    }

    default: {
      return state;
    }
  }
}
