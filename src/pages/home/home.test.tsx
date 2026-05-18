import { screen, waitFor } from '@testing-library/react';
import {
  infiniteApi,
  mockApiGetCharacters,
  mockApiGetManyCharacters,
  mockApiNotFound,
  mockApiServerError,
} from '@tests/mocks';
import { ManyCharacters, MockCharacters } from '@tests/fixtures';
import { ErrorMessages } from '@utils/constants';
import userEvent from '@testing-library/user-event';
import api from '@utils/api';
import { renderWithRouter } from '@tests/render-with-router';

const localStorageMocks = vi.hoisted(() => ({
  getValue: vi.fn(),
  setValue: vi.fn(),
}));

vi.mock('@hooks/use-local-storage', () => ({
  useLocalStorage: () => ({
    getValue: localStorageMocks.getValue,
    setValue: localStorageMocks.setValue,
  }),
}));

describe(`Home page`, () => {
  beforeEach(() => {
    localStorageMocks.getValue.mockReturnValue('');
    localStorageMocks.setValue.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initialization', () => {
    test('checks localStorage for lastSearch when renders', async () => {
      mockApiGetCharacters();
      localStorageMocks.getValue.mockReturnValue('rick');

      renderWithRouter({
        initialLocation: '/character?page=1',
      });

      await waitFor(() => {
        expect(localStorageMocks.getValue).toHaveBeenCalledTimes(1);
      });

      await screen.findByText(MockCharacters[0].name);
    });

    describe('fetching data', () => {
      beforeEach(() => {
        mockApiGetCharacters();
      });

      test('loads all characters when there is no lastSearch', async () => {
        localStorageMocks.getValue.mockReturnValue('');

        renderWithRouter({
          initialLocation: '/character?page=1',
        });

        await waitFor(() => {
          for (const character of MockCharacters) {
            expect(screen.getByText(character.name)).toBeInTheDocument();
          }
        });
      });

      test('loads last search characters when there is lastSearch', async () => {
        localStorageMocks.getValue.mockReturnValue('rick');

        renderWithRouter({
          initialLocation: '/character?page=1',
        });

        const filteredCharacters = MockCharacters.filter((character) =>
          character.name.toLowerCase().includes('rick'),
        );
        const excludedCharacters = MockCharacters.filter(
          (character) => !character.name.toLowerCase().includes('rick'),
        );

        for (const character of filteredCharacters) {
          expect(await screen.findByText(character.name)).toBeInTheDocument();
        }

        for (const character of excludedCharacters) {
          expect(screen.queryByText(character.name)).not.toBeInTheDocument();
        }
      });
    });
  });

  describe('data loading', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    test('sends API request for characters', async () => {
      mockApiGetCharacters();
      renderWithRouter({
        initialLocation: '/character?page=1',
      });

      await screen.findByText(MockCharacters[0].name);

      expect(api.getCharacters).toHaveBeenCalled();
    });

    test('signals to show/hide loader component while waiting for fetch to finish', async () => {
      let resolveRequest!: () => void;

      vi.spyOn(api, 'getCharacters').mockReturnValue(
        new Promise((resolve) => {
          resolveRequest = () => {
            resolve({
              info: {
                count: MockCharacters.length,

                pages: 1,

                next: null,

                prev: null,
              },

              results: MockCharacters,
            });
          };
        }),
      );

      renderWithRouter({
        initialLocation: '/character?page=1',
      });

      expect(await screen.findByRole('progressbar')).toBeInTheDocument();

      resolveRequest();

      expect(await screen.findByText(MockCharacters[0].name)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });
    });

    test('shows error notification when character is not found', async () => {
      mockApiNotFound();
      renderWithRouter({
        initialLocation: '/character?page=1',
      });

      expect(await screen.findByText(ErrorMessages[404])).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    test('show error notification when server returns an error', async () => {
      mockApiServerError();
      renderWithRouter({
        initialLocation: '/character?page=1',
      });

      expect(await screen.findByText(ErrorMessages[500])).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('filtering and pagination', () => {
    beforeEach(() => {
      mockApiGetManyCharacters();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    test('shows as many characters as API returns in response', async () => {
      renderWithRouter({
        initialLocation: '/character?page=1',
      });

      await screen.findByText('Character 1');

      const cards = screen.getAllByRole('listitem');

      expect(cards).toHaveLength(ManyCharacters.length);
    });

    test('shows total pages of characters', async () => {
      renderWithRouter({
        initialLocation: '/character?page=1',
      });

      expect(await screen.findByText('Page 1 of 2')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Previous' }));
      expect(screen.getByRole('button', { name: 'Next' }));
    });

    test('does not show pagination when there is only one page', async () => {
      mockApiGetCharacters();
      renderWithRouter({
        initialLocation: '/character?page=1',
      });

      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();

      await screen.findByText(MockCharacters[0].name);
    });

    test('resets to first page when new search is performed', async () => {
      const user = userEvent.setup();

      renderWithRouter({
        initialLocation: '/character?page=1',
      });

      await screen.findByText('Page 1 of 2');

      const nextButton = screen.getByRole('button', { name: 'Next' });
      await user.click(nextButton);

      await screen.findByText('Page 2 of 2');

      const input = screen.getByRole('textbox');
      await user.type(input, 'c');
      await user.click(screen.getByRole('button', { name: 'search' }));

      expect(await screen.findByText('Page 1 of 2')).toBeInTheDocument();
    });
  });

  describe('pagination navigation', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    test('scrolls to top when page changes', async () => {
      const scrollTo = vi.fn();
      vi.spyOn(window, 'scrollTo').mockImplementation(scrollTo);

      mockApiGetManyCharacters();
      const user = userEvent.setup();

      renderWithRouter({
        initialLocation: '/character?page=1',
      });

      await user.click(await screen.findByRole('button', { name: 'Next' }));
      await screen.findByText('Page 2 of 2');

      expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });

    test('navigates to previous page', async () => {
      mockApiGetManyCharacters();
      const user = userEvent.setup();

      renderWithRouter({
        initialLocation: '/character?page=1',
      });

      const nextButton = await screen.findByRole('button', { name: 'Next' });
      const previousButton = screen.getByRole('button', { name: 'Previous' });

      await user.click(nextButton);
      await screen.findByText('Page 2 of 2');
      await user.click(previousButton);

      expect(await screen.findByText('Page 1 of 2')).toBeInTheDocument();
    });

    test('does not navigate below first page', async () => {
      mockApiGetManyCharacters();

      renderWithRouter({
        initialLocation: '/character?page=1',
      });

      await screen.findByText('Page 1 of 2');

      const previousButton = screen.getByRole('button', { name: 'Previous' });
      expect(previousButton).toBeDisabled();
    });

    test('does not navigate above last page', async () => {
      mockApiGetManyCharacters();
      const user = userEvent.setup();

      renderWithRouter({
        initialLocation: '/character?page=1',
      });

      await screen.findByRole('navigation');

      const nextButton = screen.getByRole('button', { name: 'Next' });

      await user.click(nextButton);
      await screen.findByText('Page 2 of 2');

      expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    });

    test('does not navigate when loading is in progress', async () => {
      mockApiGetManyCharacters();
      const user = userEvent.setup();

      renderWithRouter({
        initialLocation: '/character?page=1',
      });

      await user.click(await screen.findByRole('button', { name: 'Next' }));

      expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();

      expect(screen.queryByText('Page 2 of 2')).not.toBeInTheDocument();
    });
  });

  describe('search', () => {
    test('updates localStorage when user enters a non-empty search term', async () => {
      const user = userEvent.setup();

      renderWithRouter({
        initialLocation: '/character?page=1',
      });

      const input = await screen.findByRole('textbox');
      const button = screen.getByRole('button', { name: 'search' });

      await user.clear(input);
      await user.type(input, 'rick');
      await user.click(button);

      expect(localStorageMocks.setValue).toHaveBeenCalledWith('rick');
    });

    test('does not initiate search when new term is the same as lastSearch', async () => {
      const user = userEvent.setup();

      renderWithRouter({
        initialLocation: '/character?page=1',
      });

      const input = await screen.findByRole('textbox');
      const button = screen.getByRole('button', { name: 'search' });

      await user.clear(input);
      await user.type(input, 'rick');
      await user.click(button);

      await user.clear(input);
      await user.type(input, 'rick');
      await user.click(button);

      expect(localStorageMocks.setValue).toHaveBeenCalledOnce();
    });

    test('does not initiate search when loading is in progress', async () => {
      infiniteApi();

      const user = userEvent.setup();

      renderWithRouter({
        initialLocation: '/character?page=1',
      });

      const input = await screen.findByRole('textbox');
      const button = screen.getByRole('button', { name: 'search' });

      await user.clear(input);
      await user.type(input, 'Rick');
      await user.click(button);

      expect(localStorageMocks.setValue).not.toHaveBeenCalled();
    });
  });
});
