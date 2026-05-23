import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, waitFor, act, fireEvent } from '@testing-library/react';
import { renderWithRouter } from '@tests/render-with-router';
import {
  infiniteApi,
  mockApiGetCharacters,
  mockApiGetManyCharacters,
  mockApiNotFound,
} from '@tests/mocks';
import { MockCharacters } from '@tests/fixtures';
import { useResultsStore } from '@store/results.store';
import userEvent from '@testing-library/user-event';

const initialStateStore = useResultsStore.getState();

describe('Home page', () => {
  beforeEach(() => {
    localStorage.clear();
    useResultsStore.setState(initialStateStore, true);
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

  describe('loader and errors', () => {
    test('signals to show loader while fetching results', async () => {
      infiniteApi();

      act(() => {
        useResultsStore.setState({ isLoading: true });
      });

      renderWithRouter({ initialLocation: '/characters?page=1' });

      expect(await screen.findByRole('progressbar')).toBeInTheDocument();
    });

    test('shows error notification when character is not found', async () => {
      mockApiNotFound();

      useResultsStore.setState({
        errorCode: 404,
        characters: [],
        isLoading: false,
        totalPages: 0,
      });

      renderWithRouter({ initialLocation: '/characters/?page=1&name=xyz' });

      expect(
        await screen.findByText(
          `Looks like this character wasn't in the show. Try looking up someone else`,
        ),
      ).toBeInTheDocument();
    });
  });

  describe('delay when changing pages', () => {
    test('navigates to next page only after delay', async () => {
      mockApiGetManyCharacters();

      window.scrollTo = vi.fn();

      const { router } = renderWithRouter({
        initialLocation: '/characters?page=1',
      });

      await screen.findByPlaceholderText(/look up rick and morty characters/i);

      const nextButton = await screen.findByRole('button', {
        name: /next/i,
      });

      vi.useFakeTimers();

      fireEvent.click(nextButton);

      expect(router.state.location.search).toEqual({
        page: 1,
      });

      act(() => {
        vi.advanceTimersByTime(999);
      });

      expect(router.state.location.search).toEqual({
        page: 1,
      });

      act(() => {
        vi.advanceTimersByTime(1);
      });

      expect(router.state.location.search).toEqual({
        page: 2,
      });

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });

      vi.useRealTimers();
    });

    test('shows new search results after delay', async () => {
      const user = userEvent.setup();

      const { router } = renderWithRouter({
        initialLocation: '/characters?page=1',
      });

      const inputField = await screen.findByPlaceholderText(/look up rick and morty characters/i);

      await user.type(inputField, 'rick');

      vi.useFakeTimers();

      fireEvent.click(screen.getByRole('button', { name: /search/i }));

      expect(router.state.location.search).toEqual({
        page: 1,
      });

      act(() => {
        vi.advanceTimersByTime(999);
      });

      expect(router.state.location.search).toEqual({
        page: 1,
      });

      act(() => {
        vi.advanceTimersByTime(1);
      });

      expect(router.state.location.search).toEqual({
        page: 1,
        name: 'rick',
      });

      vi.useRealTimers();
    });
  });
});
