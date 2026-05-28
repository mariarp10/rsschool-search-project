import type { TCharacter } from '@utils/types';

export type THomePageState = {
  searchValue: string;
  lastSearch: string;
  totalPages: number;
  charactersForPage: TCharacter[];
  isLoading: boolean;
  errorCode: number | null;
};

export type THomePageAction =
  | { type: 'setSearchValue'; payload: string }
  | { type: 'initLastSearch'; payload: string }
  | { type: 'startLoading' }
  | {
      type: 'loadSuccess';
      payload: {
        totalPages: number;
        charactersForPage: TCharacter[];
      };
    }
  | {
      type: 'loadError';
      payload: {
        errorCode: number | null;
        shouldResetResults: boolean;
      };
    }
  | { type: 'search'; payload: string };

export const initialHomePageState: THomePageState = {
  searchValue: '',
  lastSearch: '',
  totalPages: 0,
  charactersForPage: [],
  isLoading: false,
  errorCode: null,
};

export function homePageReducer(
  state: THomePageState,
  action: THomePageAction
): THomePageState {
  switch (action.type) {
    case 'setSearchValue':
      return {
        ...state,
        searchValue: action.payload,
      };

    case 'initLastSearch':
      return {
        ...state,
        searchValue: action.payload,
        lastSearch: action.payload,
      };

    case 'startLoading':
      return {
        ...state,
        isLoading: true,
        errorCode: null,
      };

    case 'loadSuccess':
      return {
        ...state,
        totalPages: action.payload.totalPages,
        charactersForPage: action.payload.charactersForPage,
        isLoading: false,
        errorCode: null,
      };

    case 'loadError':
      return {
        ...state,
        isLoading: false,
        errorCode: action.payload.errorCode,
        charactersForPage: action.payload.shouldResetResults
          ? []
          : state.charactersForPage,
        currentPage: action.payload.shouldResetResults
          ? 1
          : Math.max(state.currentPage - 1, 1),
        totalPages: action.payload.shouldResetResults ? 0 : state.totalPages,
      };

    case 'setPage':
      return {
        ...state,
        currentPage: action.payload,
      };

    case 'search':
      return {
        ...state,
        searchValue: action.payload,
        lastSearch: action.payload,
        currentPage: 1,
      };

    default:
      return state;
  }
}
