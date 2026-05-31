import React, { useEffect } from 'react';

import { Search } from '@components/search';
import { Results } from '@components/results';
import { ErrorThrower } from '@components/error-thrower';

import { UIPagination } from '@ui/pagination';
import { UIErrorNotification } from '@ui/error-notification';

import { useLocalStorage } from '@hooks/local-storage/use-local-storage';

import { Route } from '@routes/characters.index';

import { useNavigate } from '@tanstack/react-router';

import { useCharactersQuery } from '@hooks/query/use-characters-query';

import { ApiError } from '@utils/api-error';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@utils/query-keys';

export const HomePage: React.FC = () => {
  const [lastSearch, setLastSearch] = useLocalStorage('lastSearch');

  const { page = 1, name } = Route.useSearch();
  const navigate = useNavigate({ from: '/characters' });

  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, isError, error } = useCharactersQuery(page, name);

  const characters = data?.results || [];
  const totalPages = data?.info.pages || 0;
  const errorCode = error instanceof ApiError ? error.status : null;

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
  }, [page, name, lastSearch, navigate]);

  const handleNextPage = () => {
    changePage(page + 1);
  };

  const handlePreviousPage = () => {
    changePage(page - 1);
  };

  const changePage = (nextPage: number) => {
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

    setLastSearch(trimmedSearch);

    void navigate({
      search: {
        page: 1,
        name: trimmedSearch || undefined,
      },
    });
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.characters(page, name),
    });
  };

  return (
    <>
      <section style={{ paddingInline: '100px' }}>
        <Search savedSearch={lastSearch} onSearch={handleSearch} />

        {isError ? (
          <UIErrorNotification errorCode={errorCode} />
        ) : (
          <>
            {totalPages > 1 && (
              <UIPagination
                currentPage={page}
                totalPages={totalPages}
                isLoading={isLoading || isFetching}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
              />
            )}

            <Results
              handleRefresh={handleRefresh}
              characters={characters}
              isLoading={isLoading || isFetching}
            />
          </>
        )}
        <ErrorThrower />
      </section>
    </>
  );
};
