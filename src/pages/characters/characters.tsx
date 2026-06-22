'use client';

import { Search } from '@components/search/search';
import { Results } from '@components/results/results';
import { ErrorThrower } from '@components/error-thrower/error-thrower';

import { Pagination } from '@ui/pagination/pagination';
import { ErrorNotification } from '@ui/error-notification/error-notification';

import { useCharactersQuery } from '@hooks/query/use-characters-query';

import { ApiError } from '@utils/api-error';
import { useSearchParams } from 'next/navigation';

export const Characters = () => {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page') ?? 1);
  const name = searchParams.get('name') ?? undefined;

  const { data, isLoading, isFetching, isError, error } = useCharactersQuery(
    page,
    name,
  );

  const characters = data?.results ?? [];
  const totalPages = data?.info.pages ?? 0;
  const errorCode = error instanceof ApiError ? error.status : null;

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
