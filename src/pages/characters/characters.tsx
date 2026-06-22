import { Search } from '@components/search/search';
import { Results } from '@components/results/results';
import { ErrorThrower } from '@components/error-thrower/error-thrower';
import { Pagination } from '@ui/pagination/pagination';
import { getCharacters } from '@utils/api';

type CharactersProps = {
  page: number;
  name?: string;
};

export const Characters = async ({ page, name }: CharactersProps) => {
  const data = await getCharacters(page, name);

  const characters = data.results;
  const totalPages = data.info.pages;

  return (
    <section style={{ paddingInline: '100px' }}>
      <Search />

      {totalPages > 1 && (
        <Pagination totalPages={totalPages} isLoading={false} />
      )}

      <Results characters={characters} isLoading={false} />

      <ErrorThrower />
    </section>
  );
};
