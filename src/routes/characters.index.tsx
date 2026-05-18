import { createFileRoute } from '@tanstack/react-router';
import { Route as CharactersRoute } from './characters';
import { CharacterDetails } from '@components/charcter-details';

export const Route = createFileRoute('/characters/')({
  component: CharacterIndex,
});

function CharacterIndex() {
  const { detailsId } = CharactersRoute.useSearch();

  if (!detailsId) {
    return null;
  }

  return <CharacterDetails id={detailsId} />;
}
