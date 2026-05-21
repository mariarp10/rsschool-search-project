import React, { useEffect, useRef } from 'react';

import { Search } from '@components/search';
import { Results } from '@components/results';
import { ErrorThrower } from '@components/error-thrower';

import { UIPagination } from '@ui/pagination';
import { UIErrorNotification } from '@ui/error-notification';

import { useLocalStorage } from '@hooks/use-local-storage';

import { Route } from '@routes/characters.index';

import { useNavigate } from '@tanstack/react-router';

import { useResultsStore } from '../../store/results.store';

const PAGE_CHANGE_DELAY_MS = 1000;

export const HomePage: React.FC = () => {
  const pageChangeTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [lastSearch, setLastSearch] = useLocalStorage('lastSearch');

  const { page = 1, name } = Route.useSearch();
  const navigate = useNavigate({ from: '/characters' });

  const characters = useResultsStore((state) => state.characters);
  const totalPages = useResultsStore((state) => state.totalPages);
  const isLoading = useResultsStore((state) => state.isLoading);
  const errorCode = useResultsStore((state) => state.errorCode);
  const setLoading = useResultsStore((state) => state.setLoading);
  const fetchCharacters = useResultsStore((state) => state.fetchCharacters);

  const cancelCurrentTimer = () => {
    if (pageChangeTimeoutId.current) {
      clearTimeout(pageChangeTimeoutId.current);
      pageChangeTimeoutId.current = null;
    }
  };

  useEffect(() => {
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

    void fetchCharacters(page, name ?? '');
  }, [page, name, lastSearch, navigate, fetchCharacters]);

  useEffect(() => {
    return () => {
      cancelCurrentTimer();
    };
  }, []);

  const handleNextPage = () => {
    changePage(page + 1);
  };

  const handlePreviousPage = () => {
    changePage(page - 1);
  };

  const changePage = (nextPage: number) => {
    cancelCurrentTimer();
    setLoading();

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

  const handleSearch = (userInput: string) => {
    const trimmedSearch = userInput.trim().toLowerCase();

    if (trimmedSearch === lastSearch) {
      return;
    }

    cancelCurrentTimer();
    setLoading();

    pageChangeTimeoutId.current = setTimeout(() => {
      setLastSearch(trimmedSearch);

      void navigate({
        search: {
          page: 1,
          name: trimmedSearch || undefined,
        },
      });

      pageChangeTimeoutId.current = null;
    }, PAGE_CHANGE_DELAY_MS);
  };

  return (
    <>
      <section style={{ paddingInline: '100px' }}>
        <Search savedSearch={lastSearch} onSearch={handleSearch} />

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

            <Results characters={characters} isLoading={isLoading} />
          </>
        )}
        <ErrorThrower />
      </section>
    </>
  );
};
