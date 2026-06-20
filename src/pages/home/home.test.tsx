import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithRouter } from '@tests/render-with-router';
import {
  infiniteApi,
  mockApiGetCharacters,
  mockApiNotFound,
} from '@tests/mocks';
import { MockCharacters } from '@tests/fixtures';

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

      const { router } = renderWithRouter({
        initialLocation: '/characters?page=1',
      });

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

      expect(await screen.findByRole('status')).toBeInTheDocument();
    });

    test('shows error notification when character is not found', async () => {
      mockApiNotFound();

      renderWithRouter({ initialLocation: '/characters/?page=1&name=xyz' });

      expect(
        await screen.findByText(
          'Looks like this character was not in the show. Try looking up someone else.',
        ),
      ).toBeInTheDocument();
    });
  });
});
