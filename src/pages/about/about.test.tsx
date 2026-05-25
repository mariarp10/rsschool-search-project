import { render, screen } from '@testing-library/react';
import { AboutPage } from './about';

describe('AboutPage', () => {
  test('renders page heading', () => {
    render(<AboutPage />);

    expect(screen.getByRole('heading', { name: /howdy y'all/i })).toBeInTheDocument();
  });

  test('renders description text', () => {
    render(<AboutPage />);

    expect(
      screen.getByText(/this is a search application for rick and morty characters/i),
    ).toBeInTheDocument();

    expect(screen.getByText(/the application is made as a pet-project/i)).toBeInTheDocument();
    expect(screen.getByText(/though it's a major work in progress/i)).toBeInTheDocument();
  });

  test('renders external links', () => {
    render(<AboutPage />);

    const links = [
      {
        name: /rick and morty api/i,
        href: 'https://rickandmortyapi.com/',
      },
      {
        name: /rsschool react bootcamp/i,
        href: 'https://rs.school/',
      },
      {
        name: /github/i,
        href: 'https://github.com/mariarp10',
      },
    ];

    for (const { name, href } of links) {
      const link = screen.getByRole('link', { name });

      expect(link).toHaveAttribute('href', href);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noreferrer');
    }
  });

  test('renders about page image', () => {
    render(<AboutPage />);

    const image = screen.getByRole('img', {
      name: /picture of a meme/i,
    });

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/about-page-picture.jpg');
  });
});
