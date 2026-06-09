import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { NotFoundPage } from './not-found';

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual<typeof import('@tanstack/react-router')>(
    '@tanstack/react-router',
  );

  return {
    ...actual,
    Link: ({
      children,
      to,
      className,
    }: {
      children: ReactNode;
      to: string;
      className?: string;
    }) => (
      <a href={to} className={className}>
        {children}
      </a>
    ),
  };
});

describe('NotFoundPage Component', () => {
  test('renders 404 page content', () => {
    render(<NotFoundPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Sorry we could not find that page',
      }),
    ).toBeInTheDocument();

    expect(screen.getByTestId('not-found-image')).toHaveAttribute(
      'src',
      '/images/not-found-image.png',
    );

    expect(
      screen.getByRole('link', {
        name: 'Back to homepage',
      }),
    ).toHaveAttribute('href', '/');
  });
});
