import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { Results } from './results';
import { MockCharacters } from '@tests/fixtures';
import { type ReactNode } from 'react';

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual<typeof import('@tanstack/react-router')>(
    '@tanstack/react-router',
  );

  return {
    ...actual,

    Link: ({
      children,
      className,
    }: {
      children: ReactNode;
      className?: string;
    }) => (
      <a href="/characters?page=1&detailsId=1" className={className}>
        {children}
      </a>
    ),
  };
});

const createDefaultProps = () => ({
  characters: [],
  isLoading: false,
  handleRefresh: vi.fn(),
});

describe('Results Component', () => {
  test('renders cards with results on the screen', () => {
    render(<Results {...createDefaultProps()} characters={MockCharacters} />);

    const title = screen.getByRole('heading', { level: 2 });
    const charactersList = screen.getByRole('list');

    expect(title).toBeInTheDocument();
    expect(charactersList).toBeInTheDocument();
  });

  test('renders correct number of items', () => {
    render(<Results {...createDefaultProps()} characters={MockCharacters} />);

    const cards = screen.getAllByRole('listitem');

    expect(cards.length).toEqual(MockCharacters.length);
  });

  test('shows and removes loader while waiting for results', () => {
    const props = createDefaultProps();
    const { rerender } = render(<Results {...props} isLoading={true} />);

    expect(screen.getByRole('status')).toBeInTheDocument();

    rerender(
      <Results {...props} characters={MockCharacters} isLoading={false} />,
    );

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  test('shows only loader when isLoading is true', () => {
    render(<Results {...createDefaultProps()} isLoading={true} />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /refresh/i }),
    ).not.toBeInTheDocument();
  });

  test('shows new results after characters prop changes', () => {
    const props = createDefaultProps();

    const initialCharacters = [MockCharacters[0]];
    const changedCharacters = MockCharacters.slice(1);

    const { rerender } = render(
      <Results {...props} characters={initialCharacters} />,
    );

    expect(screen.getByText(initialCharacters[0].name)).toBeInTheDocument();

    rerender(<Results {...props} characters={changedCharacters} />);

    expect(screen.queryByText(MockCharacters[0].name)).not.toBeInTheDocument();

    changedCharacters.forEach((character) => {
      expect(screen.getByText(character.name)).toBeInTheDocument();
    });
  });

  test('calls refresh handler when Refresh button is clicked', async () => {
    const user = userEvent.setup();
    const props = createDefaultProps();

    render(<Results {...props} characters={MockCharacters} />);

    await user.click(
      screen.getByRole('button', {
        name: /refresh/i,
      }),
    );

    expect(props.handleRefresh).toHaveBeenCalledTimes(1);
  });
});
