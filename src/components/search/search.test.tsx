import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Search } from './search';

type SearchParamsMock = {
  page: number;
  name?: string;
};

type Mocks = {
  navigateMock: ReturnType<typeof vi.fn>;
  setLastSearchMock: ReturnType<typeof vi.fn>;
  useFetchCharactersMock: ReturnType<
    typeof vi.fn<(page: number, enabled: boolean, searchTerm: string) => void>
  >;
  searchParamsMock: SearchParamsMock;
  lastSearchMock: string;
};

const mocks = vi.hoisted<Mocks>(() => ({
  navigateMock: vi.fn(),
  setLastSearchMock: vi.fn(),
  useFetchCharactersMock:
    vi.fn<(page: number, enabled: boolean, searchTerm: string) => void>(),

  searchParamsMock: {
    page: 1,
    name: undefined,
  },

  lastSearchMock: '',
}));

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mocks.navigateMock,
}));

vi.mock('@routes/characters', () => ({
  Route: {
    useSearch: () => mocks.searchParamsMock,
  },
}));

vi.mock('@hooks/use-local-storage', () => ({
  useLocalStorage: () => [mocks.lastSearchMock, mocks.setLastSearchMock],
}));

vi.mock('@hooks/use-fetch-characters', () => ({
  useFetchCharacters: (page: number, enabled: boolean, searchTerm: string) =>
    mocks.useFetchCharactersMock(page, enabled, searchTerm),
}));

describe('Search', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.searchParamsMock.page = 1;
    mocks.searchParamsMock.name = undefined;

    mocks.lastSearchMock = '';
  });

  it('renders search input, submit button and hint', () => {
    render(<Search />);

    expect(
      screen.getByPlaceholderText('Look up Rick and Morty characters'),
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();

    expect(
      screen.getByText(
        'Try typing in names of the characters from the show: Summer, Beth, Rick',
      ),
    ).toBeInTheDocument();
  });

  it('starts fetching characters by page and name from url', () => {
    mocks.searchParamsMock.page = 2;
    mocks.searchParamsMock.name = 'rick';

    render(<Search />);

    expect(mocks.useFetchCharactersMock).toHaveBeenCalledWith(2, true, 'rick');
  });

  it('starts fetching all characters when name is not provided', () => {
    mocks.searchParamsMock.page = 1;
    mocks.searchParamsMock.name = undefined;

    render(<Search />);

    expect(mocks.useFetchCharactersMock).toHaveBeenCalledWith(1, true, '');
  });

  it('restores last search from localStorage when url does not contain name', () => {
    mocks.searchParamsMock.page = 1;
    mocks.searchParamsMock.name = undefined;

    mocks.lastSearchMock = 'morty';

    render(<Search />);

    expect(mocks.navigateMock).toHaveBeenCalledWith({
      search: {
        page: 1,
        name: 'morty',
      },
      replace: true,
    });
  });

  it('uses lastSearch as initial input value', () => {
    mocks.lastSearchMock = 'summer';

    render(<Search />);

    expect(
      screen.getByPlaceholderText('Look up Rick and Morty characters'),
    ).toHaveValue('summer');
  });

  it('updates input value when user types', () => {
    render(<Search />);

    const input = screen.getByPlaceholderText(
      'Look up Rick and Morty characters',
    );

    fireEvent.change(input, {
      target: {
        value: 'Beth',
      },
    });

    expect(input).toHaveValue('Beth');
  });

  it('saves trimmed lowercase search and navigates on submit', () => {
    render(<Search />);

    const input = screen.getByPlaceholderText(
      'Look up Rick and Morty characters',
    );

    fireEvent.change(input, {
      target: {
        value: '  Rick  ',
      },
    });

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(mocks.setLastSearchMock).toHaveBeenCalledWith('rick');

    expect(mocks.navigateMock).toHaveBeenCalledWith({
      search: {
        page: 1,
        name: 'rick',
      },
    });
  });

  it('removes name from url when submitted search is empty', () => {
    mocks.searchParamsMock.page = 1;
    mocks.searchParamsMock.name = 'rick';

    mocks.lastSearchMock = 'rick';

    render(<Search />);

    const input = screen.getByPlaceholderText(
      'Look up Rick and Morty characters',
    );

    fireEvent.change(input, {
      target: {
        value: '   ',
      },
    });

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(mocks.setLastSearchMock).toHaveBeenCalledWith('');

    expect(mocks.navigateMock).toHaveBeenCalledWith({
      search: {
        page: 1,
        name: undefined,
      },
    });
  });

  it('does nothing when submitted search equals lastSearch', () => {
    mocks.searchParamsMock.page = 1;
    mocks.searchParamsMock.name = 'rick';

    mocks.lastSearchMock = 'rick';

    render(<Search />);

    vi.clearAllMocks();

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(mocks.setLastSearchMock).not.toHaveBeenCalled();
    expect(mocks.navigateMock).not.toHaveBeenCalled();
  });
});
