import { fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { describe, test, expect, vi, beforeEach } from 'vitest';

import { CharacterDetails } from './character-details';
import { getDetails } from '@utils/api';
import { MockCharacters } from '@tests/fixtures';
import { ApiError } from '@utils/api-error';

type MockSearch = {
  page: number;
  name?: string;
  detailsId?: number;
};

const mocks = vi.hoisted(
  (): {
    navigate: ReturnType<typeof vi.fn>;
    search: MockSearch;
  } => ({
    navigate: vi.fn(),
    search: {
      page: 1,
    },
  }),
);

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router');

  return {
    ...actual,
    useNavigate: () => mocks.navigate,
  };
});

vi.mock('@routes/characters', () => ({
  Route: {
    useSearch: () => mocks.search,
  },
}));

vi.mock('@utils/api', () => ({
  getDetails: vi.fn(),
}));

const mockedGetDetails = vi.mocked(getDetails);

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
        staleTime: Infinity,
      },
    },
  });

const renderWithQueryClient = (component: ReactNode) => {
  const queryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>,
  );
};

describe('CharacterDetails Component', () => {
  beforeEach(() => {
    mocks.navigate.mockClear();

    mocks.search = {
      page: 1,
    };

    mockedGetDetails.mockReset();
  });

  test('shows loader while character details are loading', () => {
    const pendingPromise = new Promise<never>(() => {
      return undefined;
    });

    mockedGetDetails.mockReturnValue(pendingPromise);

    renderWithQueryClient(<CharacterDetails id={MockCharacters[0].id} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(mockedGetDetails).toHaveBeenCalledWith(MockCharacters[0].id);
  });

  test('renders character details', async () => {
    const character = MockCharacters[0];

    mockedGetDetails.mockResolvedValue(character);

    renderWithQueryClient(<CharacterDetails id={character.id} />);

    expect(
      await screen.findByRole('heading', {
        name: 'Details about character',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: character.name,
      }),
    ).toBeInTheDocument();

    expect(screen.getByText(`Status: ${character.status}`)).toBeInTheDocument();
    expect(
      screen.getByText(`Species: ${character.species}`),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Origin planet: ${character.origin.name}`),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        `Appeared in ${String(character.episode.length)} episode(s)`,
      ),
    ).toBeInTheDocument();

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  test('renders character image', async () => {
    const character = MockCharacters[0];

    mockedGetDetails.mockResolvedValue(character);

    renderWithQueryClient(<CharacterDetails id={character.id} />);

    const image = await screen.findByTestId('character-image');

    expect(image).toHaveAttribute('src', character.image);
  });

  test('shows placeholder image when image request fails', async () => {
    const character = MockCharacters[0];

    mockedGetDetails.mockResolvedValue(character);

    renderWithQueryClient(<CharacterDetails id={character.id} />);

    const image = await screen.findByTestId('character-image');

    fireEvent.error(image);

    expect(image).toHaveAttribute(
      'src',
      '/images/placeholder-details-image.png',
    );
  });

  test('shows error notification when details request fails', async () => {
    const NotFoundStatusCode = 404;

    mockedGetDetails.mockRejectedValue(
      new ApiError('Failed to fetch character details', NotFoundStatusCode),
    );

    renderWithQueryClient(<CharacterDetails id={999} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    expect(
      await screen.findByText(
        'Looks like this character was not in the show. Try looking up someone else.',
      ),
    ).toBeInTheDocument();

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  test('closes details panel and keeps page and name search params', async () => {
    const character = MockCharacters[0];

    mocks.search = {
      page: 2,
      name: 'rick',
      detailsId: character.id,
    };

    mockedGetDetails.mockResolvedValue(character);

    renderWithQueryClient(<CharacterDetails id={character.id} />);

    await screen.findByRole('heading', {
      name: character.name,
    });

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Close',
      }),
    );

    expect(mocks.navigate).toHaveBeenCalledWith({
      to: '/characters',
      search: {
        page: 2,
        name: 'rick',
      },
    });
  });

  test('closes details panel and keeps only page when name is not provided', async () => {
    const character = MockCharacters[0];

    mocks.search = {
      page: 3,
      detailsId: character.id,
    };

    mockedGetDetails.mockResolvedValue(character);

    renderWithQueryClient(<CharacterDetails id={character.id} />);

    await screen.findByRole('heading', {
      name: character.name,
    });

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Close',
      }),
    );

    expect(mocks.navigate).toHaveBeenCalledWith({
      to: '/characters',
      search: {
        page: 3,
      },
    });
  });

  test('refreshes character details when refresh button is clicked', async () => {
    const firstCharacter = MockCharacters[0];
    const updatedCharacter = {
      ...firstCharacter,
      name: 'Updated Rick',
      status: 'unknown',
    };

    mockedGetDetails
      .mockResolvedValueOnce(firstCharacter)
      .mockResolvedValueOnce(updatedCharacter);

    renderWithQueryClient(<CharacterDetails id={firstCharacter.id} />);

    expect(
      await screen.findByRole('heading', {
        name: firstCharacter.name,
      }),
    ).toBeInTheDocument();

    expect(mockedGetDetails).toHaveBeenCalledTimes(1);

    fireEvent.click(
      screen.getByRole('button', {
        name: /refresh/i,
      }),
    );

    expect(
      await screen.findByRole('heading', {
        name: updatedCharacter.name,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(`Status: ${updatedCharacter.status}`),
    ).toBeInTheDocument();
    expect(mockedGetDetails).toHaveBeenCalledTimes(2);
  });
});
