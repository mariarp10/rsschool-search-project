import { Search } from '@components/search/search';
import { Results } from '@components/results/results';
import { ErrorThrower } from '@components/error-thrower/error-thrower';

import { Pagination } from '@ui/pagination/pagination';
import { ErrorNotification } from '@ui/error-notification/error-notification';

import { useResultsStore } from '@store/results.store';

export const HomePage = () => {
  const characters = useResultsStore((state) => state.characters);
  const totalPages = useResultsStore((state) => state.totalPages);
  const isLoading = useResultsStore((state) => state.isLoading);
  const errorCode = useResultsStore((state) => state.errorCode);

  return (
    <>
      <section style={{ paddingInline: '100px' }}>
        <Search />

        {errorCode ? (
          <ErrorNotification errorCode={errorCode} />
        ) : (
          <>
            {totalPages > 1 && (
              <Pagination totalPages={totalPages} isLoading={isLoading} />
            )}

            <Results characters={characters} isLoading={isLoading} />
          </>
        )}
        <ErrorThrower />
      </section>
    </>
  );
};
