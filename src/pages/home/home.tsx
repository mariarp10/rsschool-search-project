import React, { useReducer, useEffect, useRef, useCallback } from 'react';

import { Search } from '@components/search';
import { Results } from '@components/results';
import { ErrorThrower } from '@components/error-thrower';

import { UIPagination } from '@ui/pagination';
import { UIErrorNotification } from '@ui/error-notification';

import { getStatusCode } from '@utils/helpers';

import { getCharacters } from '@utils/api';

import { useLocalStorage } from '@hooks/use-local-storage';

import { initialHomePageState, homePageReducer } from './home.reducer';

import { Route } from '@routes/characters.index';

import { useNavigate } from '@tanstack/react-router';

const PAGE_CHANGE_DELAY_MS = 1000;

export const HomePage: React.FC = () => {
  const [state, dispatch] = useReducer(homePageReducer, initialHomePageState);
  const pageChangeTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const { getValue: getLastSearch, setValue: saveLastSearch } =
    useLocalStorage('lastSearch');
  const { page = 1, name } = Route.useSearch();
  const navigate = useNavigate({ from: '/characters' });

  const {
    searchValue,
    lastSearch,
    charactersForPage,
    totalPages,
    isLoading,
    errorCode,
  } = state;

  const loadCharacters = useCallback(
    async (page: number, searchTerm: string) => {
      dispatch({ type: 'startLoading' });

      try {
        const { info, results } = searchTerm
          ? await getCharacters(page, searchTerm)
          : await getCharacters(page);

        dispatch({
          type: 'loadSuccess',
          payload: {
            totalPages: info.pages,
            charactersForPage: results,
          },
        });
      } catch (err) {
        dispatch({
          type: 'loadError',
          payload: {
            errorCode: getStatusCode(err),
            shouldResetResults: !(err instanceof TypeError),
          },
        });
      }
    },
    []
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

    dispatch({ type: 'initLastSearch', payload: name ?? '' });
    void loadCharacters(page, name!);

    return () => {
      if (pageChangeTimeoutId.current) {
        clearTimeout(pageChangeTimeoutId.current);
      }
    };
  }, [page, name, getLastSearch, navigate, loadCharacters]);

  const handleNextPage = () => {
    changePage(page + 1);
  };

  const handlePreviousPage = () => {
    changePage(page - 1);
  };

  const changePage = (nextPage: number) => {
    dispatch({ type: 'startLoading' });

    pageChangeTimeoutId.current = setTimeout(() => {
      void navigate({
        search: (prev) => ({
          ...prev,
          page: nextPage,
        }),
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
      pageChangeTimeoutId.current = null;
    }, PAGE_CHANGE_DELAY_MS);
  };

  const handleSearchChange = (value: string) => {
    dispatch({ type: 'setSearchValue', payload: value });
  };

  const handleSearch = (userInput: string) => {
    const trimmedSearch = userInput.trim().toLowerCase();

    if (isLoading || trimmedSearch === lastSearch) {
      return;
    }

    saveLastSearch(trimmedSearch);

    dispatch({ type: 'search', payload: trimmedSearch });

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

        {errorCode && errorCode !== 1 ? (
          <UIErrorNotification errorCode={errorCode} />
        ) : (
          <>
            {errorCode === 1 && <UIErrorNotification errorCode={errorCode} />}

            {totalPages > 1 && (
              <UIPagination
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
