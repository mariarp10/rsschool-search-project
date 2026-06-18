import { render, fireEvent } from '@testing-library/react';
import { CharacterCard } from './character-card';
import { MockCharacters } from '@tests/fixtures';
import { type ReactNode } from 'react';

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router');

  return {
    ...actual,

    Link: ({
      children,
      className,
    }: {
      children: ReactNode;
      className?: string;
    }) => (
      <a href="/characters?page=1" className={className}>
        {children}
      </a>
    ),
  };
});

const character = MockCharacters[0];

describe('CharacterCard Component', () => {
  test('shows placeholder image when image request fails with an error', () => {
    const { container } = render(<CharacterCard character={character} />);

    const img = container.querySelector('img');

    expect(img).toBeInTheDocument();

    if (img) {
      fireEvent.error(img);
    }

    expect(img).toHaveAttribute('src', '/images/placeholder-image.png');
  });
});
