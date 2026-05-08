import { render, screen } from '@testing-library/react';
import { ResultsBlock } from './results-block';
import MockCharacters from '@tests/mock-characters';

const defaultProps = {
  characters: [],
  isLoading: false,
  isEmpty: false,
};

describe('ResultsBlock Component', () => {
  test(`renders cards with results on the screen`, () => {
    render(<ResultsBlock {...defaultProps} characters={MockCharacters} />);

    const title = screen.getByRole('heading', { level: 2 });
    const charactersList = screen.getByRole('list');

    expect(title).toBeInTheDocument();
    expect(charactersList).toBeInTheDocument();
  });
  test(`renders correct number of items`, () => {
    render(<ResultsBlock {...defaultProps} characters={MockCharacters} />);

    const cards = screen.getAllByRole('listitem');

    expect(cards.length).toEqual(MockCharacters.length);
  });
  test(`shows and removes loader while waiting for results`, () => {
    const { rerender } = render(<ResultsBlock {...defaultProps} isLoading={true} />);
    expect(screen.getByRole('status')).toBeInTheDocument();

    rerender(<ResultsBlock {...defaultProps} characters={MockCharacters} isLoading={false} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
  test(`shows only loader when isLoading is true`, () => {
    render(<ResultsBlock {...defaultProps} isLoading={true} />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
  test(`shows empty message instead of results when isEmpty is true`, () => {
    render(<ResultsBlock {...defaultProps} isEmpty={true} />);

    const message = screen.getByText(`Couldn't find this character`);

    expect(message).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
  test('shows new results after characters prop changes', () => {
    const initialCharacters = [MockCharacters[0]];
    const changedCharacters = MockCharacters.slice(1);

    const { rerender } = render(<ResultsBlock {...defaultProps} characters={initialCharacters} />);

    expect(screen.getByText(initialCharacters[0].name)).toBeInTheDocument();

    rerender(<ResultsBlock {...defaultProps} characters={changedCharacters} />);

    expect(screen.queryByText(MockCharacters[0].name)).not.toBeInTheDocument();

    changedCharacters.forEach((character) => {
      expect(screen.getByText(character.name)).toBeInTheDocument();
    });
  });
});
