import { fireEvent, render, screen } from '@testing-library/react';
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

describe('CharacterDetails Component', () => {
  beforeEach(() => {
    mocks.navigate.mockClear();
    mocks.search = {
      page: 1,
    };

    mockedGetDetails.mockReset();
  });

  test('shows loader while character details are loading', () => {
    mockedGetDetails.mockResolvedValue(MockCharacters[0]);

    render(<CharacterDetails id={MockCharacters[0].id} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(mockedGetDetails).toHaveBeenCalledWith(MockCharacters[0].id);
  });

  test('renders character image', async () => {
    const character = MockCharacters[0];

    mockedGetDetails.mockResolvedValue(character);

    render(<CharacterDetails id={character.id} />);

    const image = await screen.findByRole('img', {
      name: 'Picture of character',
    });

    expect(image).toHaveAttribute('src', character.image);
  });

  test('shows placeholder image when image request fails', async () => {
    const character = MockCharacters[0];

    mockedGetDetails.mockResolvedValue(character);

    render(<CharacterDetails id={character.id} />);

    const image = await screen.findByRole('img', {
      name: 'Picture of character',
    });

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

    render(<CharacterDetails id={999} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    expect(
      await screen.findByText(
        'Looks like this character was not in the show. Try looking up someone else',
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

    render(<CharacterDetails id={character.id} />);

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

    render(<CharacterDetails id={character.id} />);

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
});
