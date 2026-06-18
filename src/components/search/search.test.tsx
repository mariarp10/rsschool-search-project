import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Search } from './search';

const navigateMock = vi.fn();
const setLastSearchMock = vi.fn();
const setLoadingMock = vi.fn();
const fetchCharactersMock = vi.fn();

let searchParamsMock: {
  page: number;
  name?: string;
};

let lastSearchMock = '';

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigateMock,
}));

vi.mock('@routes/characters', () => ({
  Route: {
    useSearch: () => searchParamsMock,
  },
}));

vi.mock('@hooks/use-local-storage', () => ({
  useLocalStorage: () => [lastSearchMock, setLastSearchMock],
}));

vi.mock('@store/results.store', () => ({
  useResultsStore: (selector: (state: unknown) => unknown) =>
    selector({
      setLoading: setLoadingMock,
      fetchCharacters: fetchCharactersMock,
    }),
}));

describe('Search', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    searchParamsMock = {
      page: 1,
      name: undefined,
    };

    lastSearchMock = '';
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

  it('fetches characters by page and name from url', async () => {
    searchParamsMock = {
      page: 2,
      name: 'rick',
    };

    render(<Search />);

    await waitFor(() => {
      expect(fetchCharactersMock).toHaveBeenCalledWith(2, 'rick');
    });
  });

  it('fetches all characters when name is not provided and lastSearch is empty', async () => {
    searchParamsMock = {
      page: 1,
      name: undefined,
    };

    lastSearchMock = '';

    render(<Search />);

    await waitFor(() => {
      expect(fetchCharactersMock).toHaveBeenCalledWith(1, '');
    });
  });

  it('restores last search from localStorage when url does not contain name', async () => {
    searchParamsMock = {
      page: 1,
      name: undefined,
    };

    lastSearchMock = 'morty';

    render(<Search />);

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith({
        search: {
          page: 1,
          name: 'morty',
        },
        replace: true,
      });
    });

    expect(fetchCharactersMock).not.toHaveBeenCalled();
  });

  it('uses lastSearch as initial input value', () => {
    lastSearchMock = 'summer';

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

    expect(setLoadingMock).toHaveBeenCalledTimes(1);
    expect(setLastSearchMock).toHaveBeenCalledWith('rick');

    expect(navigateMock).toHaveBeenCalledWith({
      search: {
        page: 1,
        name: 'rick',
      },
    });
  });

  it('removes name from url when submitted search is empty', () => {
    searchParamsMock = {
      page: 1,
      name: 'rick',
    };

    lastSearchMock = 'rick';

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

    expect(setLoadingMock).toHaveBeenCalledTimes(1);
    expect(setLastSearchMock).toHaveBeenCalledWith('');

    expect(navigateMock).toHaveBeenCalledWith({
      search: {
        page: 1,
        name: undefined,
      },
    });
  });

  it('does nothing when submitted search equals lastSearch', () => {
    lastSearchMock = 'rick';

    render(<Search />);

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(setLoadingMock).not.toHaveBeenCalled();
    expect(setLastSearchMock).not.toHaveBeenCalled();

    expect(navigateMock).not.toHaveBeenCalledWith({
      search: {
        page: 1,
        name: 'rick',
      },
    });
  });
});
