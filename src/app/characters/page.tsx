import { SplitLayout } from '@components/split-layout/split-layoyt';
import { FlyAway } from '@components/fly-away/fly-away';

export const dynamic = 'force-dynamic';

type CharactersPageProps = {
  searchParams: Promise<{
    page?: string;
    name?: string;
    detailsId?: string;
  }>;
};

const getPageNumber = (page?: string): number => {
  const pageNumber = Number(page);

  if (!Number.isInteger(pageNumber) || pageNumber < 1) {
    return 1;
  }

  return pageNumber;
};

const getCharacterId = (detailsId?: string): number | null => {
  if (!detailsId) {
    return null;
  }

  const characterId = Number(detailsId);

  if (!Number.isInteger(characterId) || characterId < 1) {
    return null;
  }

  return characterId;
};

export default async function CharactersPage({
  searchParams,
}: CharactersPageProps) {
  const params = await searchParams;

  const page = getPageNumber(params.page);
  const name = params.name;
  const characterId = getCharacterId(params.detailsId);

  return (
    <>
      <SplitLayout page={page} name={name} characterId={characterId} />
      <FlyAway />
    </>
  );
}
