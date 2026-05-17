import React, { useReducer, useEffect, useRef, useCallback } from 'react';

import { Search } from '@components/search';
import { Results } from '@components/results';
import { ErrorThrower } from '@components/error-thrower';

import { UIPagination } from '@ui/pagination';
import { UIErrorNotification } from '@ui/error-notification';

import { getStatusCode } from '@utils/helpers';

import api from '@utils/api';

import { useLocalStorage } from '@hooks/use-local-storage';

import { initialHomePageState, homePageReducer } from './home.reducer';

const PAGE_CHANGE_DELAY_MS = 400;

export const HomePage: React.FC = () => {
  const [state, dispatch] = useReducer(homePageReducer, initialHomePageState);
  const pageChangeTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { getValue: getLastSearch, setValue: saveLastSearch } = useLocalStorage('lastSearch');

  const {
    searchValue,
    lastSearch,
    charactersForPage,
    currentPage,
    totalPages,
    isLoading,
    errorCode,
  } = state;

  const loadCharacters = useCallback(async (page: number, search: string) => {
    dispatch({ type: 'startLoading' });

    try {
      const { info, results } = search
        ? await api.getCharacters(page, search)
        : await api.getCharacters(page);

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
  }, []);

  useEffect(() => {
    const lastSearch = getLastSearch();

    dispatch({ type: 'initLastSearch', payload: lastSearch });

    void loadCharacters(1, lastSearch);

    return () => {
      if (pageChangeTimeoutId.current) {
        clearTimeout(pageChangeTimeoutId.current);
      }
    };
  }, [getLastSearch, loadCharacters]);

  const handleNextPage = () => {
    changePage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    changePage(currentPage - 1);
  };

  const changePage = (page: number) => {
    dispatch({ type: 'startLoading' });

    pageChangeTimeoutId.current = setTimeout(() => {
      dispatch({ type: 'setPage', payload: page });
      void loadCharacters(page, lastSearch);
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

    void loadCharacters(1, trimmedSearch);
  };

  return (
    <>
      <section style={{ paddingInline: '100px' }}>
        <Search value={searchValue} onChange={handleSearchChange} onSearch={handleSearch} />

        {errorCode && errorCode !== 1 ? (
          <UIErrorNotification errorCode={errorCode} />
        ) : (
          <>
            {errorCode === 1 && <UIErrorNotification errorCode={errorCode} />}

            {totalPages > 1 && (
              <UIPagination
                currentPage={currentPage}
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
