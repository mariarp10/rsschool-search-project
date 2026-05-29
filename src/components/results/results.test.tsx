import { render, screen } from '@testing-library/react';
import { Results } from './results';
import { MockCharacters } from '@tests/fixtures';
import { type ReactNode } from 'react';

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual<typeof import('@tanstack/react-router')>(
    '@tanstack/react-router'
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

const defaultProps = {
  characters: [],
  isLoading: false,
};

describe('Results Component', () => {
  test(`renders cards with results on the screen`, () => {
    render(<Results {...defaultProps} characters={MockCharacters} />);

    const title = screen.getByRole('heading', { level: 2 });
    const charactersList = screen.getByRole('list');

    expect(title).toBeInTheDocument();
    expect(charactersList).toBeInTheDocument();
  });
  test(`renders correct number of items`, () => {
    render(<Results {...defaultProps} characters={MockCharacters} />);

    const cards = screen.getAllByRole('listitem');

    expect(cards.length).toEqual(MockCharacters.length);
  });
  test(`shows and removes loader while waiting for results`, () => {
    const { rerender } = render(<Results {...defaultProps} isLoading={true} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    rerender(
      <Results
        {...defaultProps}
        characters={MockCharacters}
        isLoading={false}
      />
    );
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
  test(`shows only loader when isLoading is true`, () => {
    render(<Results {...defaultProps} isLoading={true} />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
  test('shows new results after characters prop changes', () => {
    const initialCharacters = [MockCharacters[0]];
    const changedCharacters = MockCharacters.slice(1);

    const { rerender } = render(
      <Results {...defaultProps} characters={initialCharacters} />
    );

    expect(screen.getByText(initialCharacters[0].name)).toBeInTheDocument();

    rerender(<Results {...defaultProps} characters={changedCharacters} />);

    expect(screen.queryByText(MockCharacters[0].name)).not.toBeInTheDocument();

    changedCharacters.forEach((character) => {
      expect(screen.getByText(character.name)).toBeInTheDocument();
    });
  });
});
