import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { CharacterCard } from './character-card';
import { MockCharacters } from '@tests/fixtures';
import { useSelectionStore } from '@store/selection.store';

const linkMock = vi.hoisted(() => ({
  currentSearch: {
    page: 2,
    name: 'rick',
  },

  resolvedSearch: vi.fn(),
}));

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router');

  return {
    ...actual,
    Link: ({
      children,
      className,
      search,
    }: {
      children: React.ReactNode;
      className?: string;

      search?: (prev: { page?: number; name?: string }) => unknown;
    }) => (
      <a
        href="/characters"
        className={className}
        onClick={(event) => {
          event.preventDefault();

          if (search) {
            const nextSearch = search(linkMock.currentSearch);
            linkMock.resolvedSearch(nextSearch);
          }
        }}
      >
        {children}
      </a>
    ),
  };
});

const character = MockCharacters[0];

describe('CharacterCard', () => {
  beforeEach(() => {
    useSelectionStore.setState({
      selectedCharacters: [],
    });

    linkMock.currentSearch = {
      page: 2,
      name: 'rick',
    };

    linkMock.resolvedSearch.mockClear();
  });

  test('renders character data', () => {
    render(<CharacterCard character={character} />);

    expect(screen.getByRole('heading', { name: character.name })).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/characters');
  });

  test('selects character and updates store when checkbox is checked', async () => {
    const user = userEvent.setup();

    render(<CharacterCard character={character} />);

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toBeChecked();
    expect(useSelectionStore.getState().selectedCharacters).toEqual([]);

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(useSelectionStore.getState().selectedCharacters).toEqual([character]);
  });

  test('unselects character and updates store when checkbox is unchecked', async () => {
    const user = userEvent.setup();

    useSelectionStore.setState({
      selectedCharacters: [character],
    });

    render(<CharacterCard character={character} />);

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeChecked();
    expect(useSelectionStore.getState().selectedCharacters).toEqual([character]);

    await user.click(checkbox);

    expect(checkbox).not.toBeChecked();
    expect(useSelectionStore.getState().selectedCharacters).toEqual([]);
  });

  test('shows fallback image when character image fails to load', () => {
    const { container } = render(<CharacterCard character={character} />);

    const image = container.querySelector('img');

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', character.image);

    fireEvent.error(image!);

    expect(image).toHaveAttribute('src', '/images/placeholder-image.png');
  });

  test('updates search params when card is clicked', async () => {
    const user = userEvent.setup();

    render(<CharacterCard character={character} />);

    await user.click(screen.getByRole('link'));

    expect(linkMock.resolvedSearch).toHaveBeenCalledWith({
      page: 2,
      name: 'rick',
      detailsId: character.id,
    });
  });
});
