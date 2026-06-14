import { type FC, useEffect } from 'react';

import { Search } from '@components/search/search';
import { Results } from '@components/results/results';
import { ErrorThrower } from '@components/error-thrower/error-thrower';

import { Pagination } from '@ui/pagination/pagination';
import { ErrorNotification } from '@ui/error-notification/error-notification';

import { useLocalStorage } from '@hooks/use-local-storage';

import { Route } from '@routes/characters.index';

import { useNavigate } from '@tanstack/react-router';

import { useResultsStore } from '@store/results.store';

export const HomePage: FC = () => {
  const [lastSearch, setLastSearch] = useLocalStorage('lastSearch');

  const { page, name } = Route.useSearch();
  const navigate = useNavigate({ from: '/characters' });

  const characters = useResultsStore((state) => state.characters);
  const totalPages = useResultsStore((state) => state.totalPages);
  const isLoading = useResultsStore((state) => state.isLoading);
  const errorCode = useResultsStore((state) => state.errorCode);
  const setLoading = useResultsStore((state) => state.setLoading);
  const fetchCharacters = useResultsStore((state) => state.fetchCharacters);

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

  const handleNextPage = () => {
    changePage(page + 1);
  };

  const handlePreviousPage = () => {
    changePage(page - 1);
  };

  const changePage = (nextPage: number) => {
    setLoading();

    void navigate({
      search: (prev) => ({
        ...prev,
        page: nextPage,
      }),
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (userInput: string) => {
    const trimmedSearch = userInput.trim().toLowerCase();

    if (trimmedSearch === lastSearch) {
      return;
    }

    setLoading();

    setLastSearch(trimmedSearch);

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
        <Search savedSearch={lastSearch} onSearch={handleSearch} />

        {errorCode ? (
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

            <Results characters={characters} isLoading={isLoading} />
          </>
        )}
        <ErrorThrower />
      </section>
    </>
  );
};
