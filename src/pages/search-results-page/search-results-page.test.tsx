import { render, screen } from '@testing-library/react';
import * as helpers from '@utils/helpers';
import { infiniteFetch, mockFetch, mockFetchError, mockFetchManyCharacters } from '@tests/mocks';
import { MockCharacters } from '@tests/fixtures';
import { SearchResultsPage } from './search-result-page';
import { ErrorMessages } from '../../error-messages';
import userEvent from '@testing-library/user-event';

describe(`Search Results Page Component`, () => {
  describe('initialization', () => {
    test('checks localStorage for lastSearch when renders', () => {
      vi.spyOn(helpers, 'getLastSearch').mockReturnValue('rick');

      render(<SearchResultsPage />);

      expect(helpers.getLastSearch).toHaveBeenCalledTimes(1);
    });
    describe('fetching data', () => {
      beforeEach(() => {
        mockFetch();
      });

      afterEach(() => {
        vi.restoreAllMocks();
      });

      test('loads all characters when there is no lastSearch', async () => {
        vi.spyOn(helpers, 'getLastSearch').mockReturnValue('');

        render(<SearchResultsPage />);

        for (const character of MockCharacters) {
          expect(await screen.findByText(character.name)).toBeInTheDocument();
        }
      });
      test('loads last search characters when there is lastSearch', async () => {
        vi.spyOn(helpers, 'getLastSearch').mockReturnValue('rick');

        render(<SearchResultsPage />);

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
      vi.resetAllMocks();
    });

    test('loads characters from JSON file', async () => {
      mockFetch();
      render(<SearchResultsPage />);

      await screen.findByText(MockCharacters[0].name);

      expect(fetch).toHaveBeenCalledWith('/all-characters.json');
    });
    test('signals to show/hide loader component while waiting for fetch to finish', async () => {
      mockFetch();

      render(<SearchResultsPage />);

      expect(screen.getByRole('status')).toBeInTheDocument();

      await screen.findByText(MockCharacters[0].name);

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    test(`catches error when can't find JSON file with characters`, async () => {
      mockFetchError();

      render(<SearchResultsPage />);

      expect(await screen.findByRole('alert')).toBeInTheDocument();
    });
    test('displays a human readable error message when there is an HTTP error', async () => {
      mockFetchError();

      render(<SearchResultsPage />);

      expect(await screen.findByText(ErrorMessages[1])).toBeInTheDocument();

      expect(screen.queryByText(MockCharacters[0].name)).not.toBeInTheDocument();

      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });
  });
  describe('filtering and pagination', () => {
    beforeEach(() => {
      mockFetchManyCharacters();
    });

    afterEach(() => {
      vi.resetAllMocks();
    });

    test('selects a specified amount of characters to display on the page', async () => {
      render(<SearchResultsPage />);

      await screen.findByText('Character 1');

      const cards = screen.getAllByRole('listitem');

      expect(cards).toHaveLength(20);
    });
    test('calculates total pages of characters', async () => {
      render(<SearchResultsPage />);

      expect(await screen.findByText('Page 1 of 2')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Previous' }));
      expect(screen.getByRole('button', { name: 'Next' }));
    });
    test('does not show pagination when there is only one page', async () => {
      mockFetch();

      render(<SearchResultsPage />);

      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });
    test('resets to first page when new search is performed', async () => {
      const user = userEvent.setup();

      render(<SearchResultsPage />);

      await screen.findByText('Page 1 of 2');

      const nextButton = screen.getByRole('button', { name: 'Next' });
      user.click(nextButton);

      await screen.findByText('Page 2 of 2');

      const input = screen.getByRole('textbox');
      await user.type(input, 'c');
      await user.click(screen.getByRole('button', { name: 'search' }));

      expect(await screen.findByText('Page 1 of 2')).toBeInTheDocument();
    });
  });
  describe('pagination navigation', () => {
    afterEach(() => {
      vi.clearAllMocks();
    });

    test('scrolls to top when page changes', async () => {
      const scrollTo = vi.fn();
      vi.spyOn(window, 'scrollTo').mockImplementation(scrollTo);

      mockFetchManyCharacters();
      const user = userEvent.setup();

      render(<SearchResultsPage />);

      await user.click(await screen.findByRole('button', { name: 'Next' }));
      await screen.findByText('Page 2 of 2');

      expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });
    test('navigates to previous page', async () => {
      mockFetchManyCharacters();
      const user = userEvent.setup();

      render(<SearchResultsPage />);

      const nextButton = await screen.findByRole('button', { name: 'Next' });
      const previousButton = screen.getByRole('button', { name: 'Previous' });

      await user.click(nextButton);
      await screen.findByText('Page 2 of 2');
      await user.click(previousButton);

      expect(await screen.findByText('Page 1 of 2')).toBeInTheDocument();
    });
    test('does not navigate below first page', async () => {
      mockFetchManyCharacters();

      render(<SearchResultsPage />);

      await screen.findByText('Page 1 of 2');

      const previousButton = screen.getByRole('button', { name: 'Previous' });
      expect(previousButton).toBeDisabled();
    });
    test('does not navigate above last page', async () => {
      mockFetchManyCharacters();
      const user = userEvent.setup();

      render(<SearchResultsPage />);

      await screen.findByRole('navigation');

      const nextButton = screen.getByRole('button', { name: 'Next' });

      await user.click(nextButton);
      await screen.findByText('Page 2 of 2');

      expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    });
    test('does not navigate when loading is in progress', async () => {
      mockFetchManyCharacters();
      const user = userEvent.setup();

      render(<SearchResultsPage />);

      await user.click(await screen.findByRole('button', { name: 'Next' }));

      expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();

      expect(screen.queryByText('Page 2 of 2')).not.toBeInTheDocument();
    });
  });
  describe('search', () => {
    test('updates localStorage when user enters a non-empty search term', async () => {
      vi.spyOn(helpers, 'saveLastSearch');
      const user = userEvent.setup();

      render(<SearchResultsPage />);

      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button', { name: 'search' });

      await user.clear(input);
      await user.type(input, 'rick');
      await user.click(button);

      expect(helpers.saveLastSearch).toHaveBeenCalledWith('rick');
    });
    test('does not initiate search when new term is the same as lastSearch', async () => {
      vi.spyOn(helpers, 'saveLastSearch');
      const user = userEvent.setup();

      render(<SearchResultsPage />);

      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button', { name: 'search' });

      await user.clear(input);
      await user.type(input, 'rick');
      await user.click(button);

      await user.clear(input);
      await user.type(input, 'rick');
      await user.click(button);

      expect(helpers.saveLastSearch).toHaveBeenCalledOnce();
    });
    test('does not initiate search when loading is in progress', async () => {
      infiniteFetch();
      vi.spyOn(helpers, 'saveLastSearch');

      const user = userEvent.setup();

      render(<SearchResultsPage />);

      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button', { name: 'search' });

      await user.clear(input);
      await user.type(input, 'Rick');
      await user.click(button);

      await user.clear(input);
      await user.type(input, 'Morty');
      await user.click(button);

      expect(helpers.saveLastSearch).toHaveBeenCalledOnce();
      expect(helpers.saveLastSearch).toHaveBeenCalledWith('rick');
    });
  });
});
