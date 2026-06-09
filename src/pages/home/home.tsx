import { type FC, useReducer, useEffect, useCallback } from 'react';

import { Search } from '@components/search/search';
import { Results } from '@components/results/results';
import { ErrorThrower } from '@components/error-thrower/error-thrower';

import { Pagination } from '@ui/pagination/pagination';
import { ErrorNotification } from '@ui/error-notification/error-notification';

import { getCharacters } from '@utils/api';
import { ApiError } from '@utils/api-error';

import { useLocalStorage } from '@hooks/use-local-storage';

import { initialHomePageState, homePageReducer } from './home.reducer';

import { Route } from '@routes/characters.index';

import { useNavigate } from '@tanstack/react-router';

export const HomePage: FC = () => {
  const [state, dispatch] = useReducer(homePageReducer, initialHomePageState);

  const { getValue: getLastSearch, setValue: saveLastSearch } =
    useLocalStorage('lastSearch');
  const { page, name } = Route.useSearch();
  const navigate = useNavigate({ from: '/characters' });

  const {
    searchValue,
    lastSearch,
    charactersForPage,
    totalPages,
    hasError,
    isLoading,
    errorCode,
  } = state;

  const loadCharacters = useCallback(
    async (page: number, searchTerm: string) => {
      dispatch({ type: 'START_LOADING' });

      try {
        const { info, results } = searchTerm
          ? await getCharacters(page, searchTerm)
          : await getCharacters(page);

        dispatch({
          type: 'LOAD_SUCCESS',
          payload: {
            totalPages: info.pages,
            charactersForPage: results,
          },
        });
      } catch (error) {
        dispatch({
          type: 'LOAD_ERROR',
          payload: {
            errorCode: error instanceof ApiError ? error.status : null,
            shouldResetResults: !(error instanceof TypeError),
          },
        });
      }
    },
    [],
  );

  useEffect(() => {
    const lastSearch = getLastSearch();

    if (!name && lastSearch) {
      void navigate({
        search: {
          page: 1,
          name: lastSearch,
        },
        replace: true,
      });

      return;
    }

    dispatch({ type: 'INIT_LAST_SEARCH', payload: name ?? '' });
    void loadCharacters(page, name ?? '');
  }, [page, name, getLastSearch, navigate, loadCharacters]);

  const handleNextPage = () => {
    changePage(page + 1);
  };

  const handlePreviousPage = () => {
    changePage(page - 1);
  };

  const changePage = (nextPage: number) => {
    dispatch({ type: 'START_LOADING' });

    void navigate({
      search: (prev) => ({
        ...prev,
        page: nextPage,
      }),
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (value: string) => {
    dispatch({ type: 'SET_SEARCH_VALUE', payload: value });
  };

  const handleSearch = (userInput: string) => {
    const trimmedSearch = userInput.trim().toLowerCase();

    if (isLoading || trimmedSearch === lastSearch) {
      return;
    }

    saveLastSearch(trimmedSearch);

    dispatch({ type: 'SEARCH', payload: trimmedSearch });

    void navigate({
      search: {
        page: 1,
        name: trimmedSearch || undefined,
      },
    });
  };

  return (
    <>
      <section style={{ paddingInline: '100px' }}>
        <Search
          value={searchValue}
          onChange={handleSearchChange}
          onSearch={handleSearch}
        />

        {hasError ? (
          <ErrorNotification errorCode={errorCode} />
        ) : (
          <>
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                isLoading={isLoading}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
              />
            )}

            <Results characters={charactersForPage} isLoading={isLoading} />
          </>
        )}
        <ErrorThrower />
      </section>
    </>
  );
};
