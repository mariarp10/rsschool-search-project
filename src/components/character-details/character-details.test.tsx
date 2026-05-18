import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { CharacterDetails } from './character-details';
import { getDetails } from '@utils/api';
import { MockCharacters } from '@tests/fixtures';

const DETAILS_CHANGE_DELAY_MS = 1000;

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  search: {
    page: 1,
  } as {
    page: number;
    name?: string;
    detailsId?: number;
  },
}));

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

const flushDetailsLoading = async () => {
  await act(async () => {
    await Promise.resolve();
  });

  act(() => {
    vi.advanceTimersByTime(DETAILS_CHANGE_DELAY_MS);
  });
};

describe('CharacterDetails Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();

    mocks.navigate.mockClear();
    mocks.search = {
      page: 1,
    };

    mockedGetDetails.mockReset();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  test('shows loader while character details are loading', () => {
    mockedGetDetails.mockResolvedValue(MockCharacters[0]);

    render(<CharacterDetails id={MockCharacters[0].id} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(mockedGetDetails).toHaveBeenCalledWith(MockCharacters[0].id);
  });

  test('renders character details after loading delay', async () => {
    const character = MockCharacters[0];

    mockedGetDetails.mockResolvedValue(character);

    render(<CharacterDetails id={character.id} />);

    await flushDetailsLoading();

    expect(screen.getByRole('heading', { name: 'Details about character' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: character.name })).toBeInTheDocument();

    expect(screen.getByText(`Status: ${character.status}`)).toBeInTheDocument();
    expect(screen.getByText(`Species: ${character.species}`)).toBeInTheDocument();
    expect(screen.getByText(`Origin planet: ${character.origin.name}`)).toBeInTheDocument();
    expect(
      screen.getByText(`Appeared in ${character.episode.length} episode(s)`),
    ).toBeInTheDocument();

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  test('renders character image', async () => {
    const character = MockCharacters[0];

    mockedGetDetails.mockResolvedValue(character);

    render(<CharacterDetails id={character.id} />);

    await flushDetailsLoading();

    const image = screen.getByRole('img', {
      name: 'Picture of character',
    });

    expect(image).toHaveAttribute('src', character.image);
  });

  test('shows placeholder image when image request fails', async () => {
    const character = MockCharacters[0];

    mockedGetDetails.mockResolvedValue(character);

    render(<CharacterDetails id={character.id} />);

    await flushDetailsLoading();

    const image = screen.getByRole('img', {
      name: 'Picture of character',
    });

    fireEvent.error(image);

    expect(image).toHaveAttribute('src', '/images/placeholder-details-image.png');
  });

  test('shows error notification when details request fails', async () => {
    mockedGetDetails.mockRejectedValue(
      new Response(JSON.stringify({ error: 'There is nothing here' }), { status: 404 }),
    );

    render(<CharacterDetails id={999} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await flushDetailsLoading();

    expect(
      screen.getByText(
        `Looks like this this character wasn't in the show. Try looking up someone else`,
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

    await flushDetailsLoading();

    fireEvent.click(
      screen.getByRole('button', {
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

    await flushDetailsLoading();

    fireEvent.click(
      screen.getByRole('button', {
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
