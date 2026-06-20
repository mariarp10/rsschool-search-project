import { Search } from '@components/search/search';
import { Results } from '@components/results/results';
import { ErrorThrower } from '@components/error-thrower/error-thrower';

import { Pagination } from '@ui/pagination/pagination';
import { ErrorNotification } from '@ui/error-notification/error-notification';

import { Route } from '@routes/characters.index';

import { useCharactersQuery } from '@hooks/query/use-characters-query';

import { ApiError } from '@utils/api-error';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@utils/query-keys';

export const HomePage = () => {
  const { page, name } = Route.useSearch();

  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, isError, error } = useCharactersQuery(
    page,
    name,
  );

  const characters = data?.results ?? [];
  const totalPages = data?.info.pages ?? 0;
  const errorCode = error instanceof ApiError ? error.status : null;

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({
      queryKey: queryKeys.characters(page, name),
    });
  };

  return (
    <>
      <section style={{ paddingInline: '100px' }}>
        <Search />

        {isError ? (
          <ErrorNotification errorCode={errorCode} />
        ) : (
          <>
            {totalPages > 1 && (
              <Pagination
                totalPages={totalPages}
                isLoading={isLoading || isFetching}
              />
            )}

            <Results
              handleRefresh={() => void handleRefresh}
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
