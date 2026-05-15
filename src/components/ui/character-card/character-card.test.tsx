import { render, screen, fireEvent } from '@testing-library/react';
import { CharacterCard } from './character-card';
import { MockCharacters } from '@tests/fixtures';

const character = MockCharacters[0];

describe('CharacterCard Component', () => {
  test('shows placeholder image when image request fails with an error', () => {
    render(<CharacterCard character={character} />);

    const img = screen.getByRole('img', { name: 'Picture of character' });

    fireEvent.error(img);

    expect(img).toHaveAttribute('src', '/images/placeholder-image.png');
  });
});
