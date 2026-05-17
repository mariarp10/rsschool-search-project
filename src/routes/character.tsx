import { createFileRoute } from '@tanstack/react-router';
import { HomePage } from '@pages/home';

type TCharacterSearch = {
  page: number;
  name?: string;
};

export const Route = createFileRoute('/character')({
  validateSearch: (search: Record<string, unknown>): TCharacterSearch => {
    const page = Number(search.page ?? 1);

    return {
      page: Number.isFinite(page) && page > 0 ? page : 1,
      name: typeof search.name === 'string' && search.name.length > 0 ? search.name : undefined,
    };
  },
  component: HomePage,
});
