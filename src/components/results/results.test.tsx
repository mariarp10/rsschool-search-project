import {
  render,
  screen,
  waitFor,
  type RenderResult,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';

import { Results } from './results';
import { MockCharacters } from '@tests/fixtures';
import { queryKeys } from '@utils/query-keys';
import type { Character } from '@utils/types';

vi.mock('@routes/characters.index', () => ({
  Route: {
    useSearch: () => ({
      page: 1,
      name: undefined,
    }),
  },
}));

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual<typeof import('@tanstack/react-router')>(
    '@tanstack/react-router',
  );

  return {
    ...actual,

    Link: ({
      children,
      className,
    }: {
      children: ReactNode;
      className?: string;
    }) => (
      <a href="/characters?page=1&detailsId=1" className={className}>
        {children}
      </a>
    ),
  };
});

type ResultsProps = {
  characters: Character[];
  isLoading: boolean;
};

type RenderResultsResult = RenderResult & {
  queryClient: QueryClient;
};

const createTestQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

const createDefaultProps = (): ResultsProps => ({
  characters: [],
  isLoading: false,
});

const renderResults = (
  props: Partial<ResultsProps> = {},
): RenderResultsResult => {
  const queryClient = createTestQueryClient();

  const result = render(
    <QueryClientProvider client={queryClient}>
      <Results {...createDefaultProps()} {...props} />
    </QueryClientProvider>,
  );

  return {
    queryClient,
    ...result,
  };
};

describe('Results Component', () => {
  test('renders cards with results on the screen', () => {
    renderResults({
      characters: MockCharacters,
    });

    const title = screen.getByRole('heading', { level: 2 });
    const charactersList = screen.getByRole('list');

    expect(title).toBeInTheDocument();
    expect(charactersList).toBeInTheDocument();
  });

  test('renders correct number of items', () => {
    renderResults({
      characters: MockCharacters,
    });

    const cards = screen.getAllByRole('listitem');

    expect(cards.length).toEqual(MockCharacters.length);
  });

  test('shows and removes loader while waiting for results', () => {
    const { rerender, queryClient } = renderResults({
      isLoading: true,
    });

    expect(screen.getByRole('status')).toBeInTheDocument();

    rerender(
      <QueryClientProvider client={queryClient}>
        <Results characters={MockCharacters} isLoading={false} />
      </QueryClientProvider>,
    );

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  test('shows only loader when isLoading is true', () => {
    renderResults({
      isLoading: true,
    });

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /refresh/i }),
    ).not.toBeInTheDocument();
  });

  test('shows new results after characters prop changes', () => {
    const initialCharacters = [MockCharacters[0]];
    const changedCharacters = MockCharacters.slice(1);

    const { rerender, queryClient } = renderResults({
      characters: initialCharacters,
    });

    expect(screen.getByText(initialCharacters[0].name)).toBeInTheDocument();

    rerender(
      <QueryClientProvider client={queryClient}>
        <Results characters={changedCharacters} isLoading={false} />
      </QueryClientProvider>,
    );

    expect(screen.queryByText(MockCharacters[0].name)).not.toBeInTheDocument();

    changedCharacters.forEach((character) => {
      expect(screen.getByText(character.name)).toBeInTheDocument();
    });
  });

  test('invalidates characters query when Refresh button is clicked', async (): Promise<void> => {
    const user = userEvent.setup();

    const { queryClient } = renderResults({
      characters: MockCharacters,
    });

    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    await user.click(
      screen.getByRole('button', {
        name: /refresh/i,
      }),
    );

    await waitFor(() => {
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: queryKeys.characters(1, undefined),
      });
    });
  });
});
