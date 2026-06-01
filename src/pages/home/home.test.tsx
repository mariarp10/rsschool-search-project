import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithRouter } from '@tests/render-with-router';
import {
  infiniteApi,
  mockApiGetCharacters,
  mockApiNotFound,
  mockApiRefreshCharacters,
  mockApiGetManyCharacters,
} from '@tests/mocks';
import { MockCharacters } from '@tests/fixtures';
import userEvent from '@testing-library/user-event';

describe('Home page', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('URL and characters', () => {
    test('loads and shows characters when there is no name in search params', async () => {
      mockApiGetCharacters();

      renderWithRouter({ initialLocation: '/characters?page=1' });

      for (const character of MockCharacters) {
        expect(await screen.findByText(character.name)).toBeInTheDocument();
      }
    });

    test('adds lastSearch to search params when there is no name in URL', async () => {
      localStorage.setItem('lastSearch', JSON.stringify('rick'));

      const { router } = renderWithRouter({ initialLocation: '/characters?page=1' });

      await waitFor(() => {
        expect(router.state.location.search).toEqual({ page: 1, name: 'rick' });
      });
    });

    test('loads and shows character from search params', async () => {
      mockApiGetCharacters();

      renderWithRouter({ initialLocation: '/characters?page=1&name=morty' });

      await screen.findByText(MockCharacters[1].name);
    });
  });

  describe('loading, errors, and invalidation', () => {
    test('signals to show loader while fetching results', async () => {
      infiniteApi();

      renderWithRouter({ initialLocation: '/characters?page=1' });

      expect(await screen.findByRole('progressbar')).toBeInTheDocument();
    });

    test('shows error notification when character is not found', async () => {
      mockApiNotFound();

      renderWithRouter({ initialLocation: '/characters/?page=1&name=xyz' });

      expect(
        await screen.findByText(
          `Looks like this character wasn't in the show. Try looking up someone else`,
        ),
      ).toBeInTheDocument();
    });

    test('invalidates characters cache and refetches data when refresh is clicked', async () => {
      const user = userEvent.setup();

      const getCharactersSpy = mockApiRefreshCharacters();

      renderWithRouter({
        queryOptions: {
          queries: {
            staleTime: Infinity,
            gcTime: Infinity,
          },
        },
      });

      expect(await screen.findByText(MockCharacters[0].name)).toBeInTheDocument();
      expect(getCharactersSpy).toHaveBeenCalledTimes(1);

      await user.click(screen.getByRole('button', { name: /refresh/i }));

      expect(await screen.findByText(MockCharacters[1].name)).toBeInTheDocument();
      expect(getCharactersSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('pagination and search', () => {
    test('navigates to previous page when previous button is clicked', async () => {
      mockApiGetManyCharacters();

      window.scrollTo = vi.fn();

      const user = userEvent.setup();

      const { router } = renderWithRouter({
        initialLocation: '/characters?page=2',
      });

      const previousButton = await screen.findByRole('button', {
        name: /previous/i,
      });

      await user.click(previousButton);

      await waitFor(() => {
        expect(router.state.location.search).toEqual({
          page: 1,
        });
      });

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });

    test('navigates with new search params when search is submitted', async () => {
      mockApiGetCharacters();

      const user = userEvent.setup();

      const { router } = renderWithRouter({
        initialLocation: '/characters?page=1',
      });

      const input = await screen.findByPlaceholderText(/look up rick and morty characters/i);

      await user.type(input, 'Rick');

      await user.click(screen.getByRole('button', { name: /search/i }));

      await waitFor(() => {
        expect(router.state.location.search).toEqual({
          page: 1,
          name: 'rick',
        });
      });

      expect(localStorage.getItem('lastSearch')).toBe(JSON.stringify('rick'));
    });

    test('removes name search param when empty search is submitted', async () => {
      localStorage.setItem('lastSearch', JSON.stringify('rick'));

      mockApiGetCharacters();

      const user = userEvent.setup();

      const { router } = renderWithRouter({
        initialLocation: '/characters?page=1&name=rick',
      });

      const input = await screen.findByPlaceholderText(/look up rick and morty characters/i);

      await user.clear(input);

      await user.click(screen.getByRole('button', { name: /search/i }));

      await waitFor(() => {
        expect(router.state.location.search).toEqual({
          page: 1,
        });
      });

      expect(localStorage.getItem('lastSearch')).toBe(JSON.stringify(''));
    });

    test('does not navigate when submitted search is the same as last search', async () => {
      localStorage.setItem('lastSearch', JSON.stringify('rick'));

      mockApiGetCharacters();

      const user = userEvent.setup();

      const { router } = renderWithRouter({
        initialLocation: '/characters?page=1&name=rick',
      });

      await screen.findByText(MockCharacters[0].name);

      await user.click(screen.getByRole('button', { name: /search/i }));

      expect(router.state.location.search).toEqual({
        page: 1,
        name: 'rick',
      });

      expect(localStorage.getItem('lastSearch')).toBe(JSON.stringify('rick'));
    });
  });
});
