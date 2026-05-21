import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { Search } from './search';

const defaultProps = {
  savedSearch: '',
  onSearch: vi.fn(),
};

describe('Search Component', () => {
  test('renders input, search button, and hint', () => {
    render(<Search {...defaultProps} />);

    const inputElement = screen.getByPlaceholderText('Look up Rick and Morty characters');
    const searchButton = screen.getByRole('button', { name: /search/i });
    const hintElement = screen.getByText(
      'Try typing in names of the characters from the show: Summer, Beth, Rick',
    );

    expect(inputElement).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
    expect(hintElement).toBeInTheDocument();
  });

  test('displays value from props as initial value', () => {
    render(<Search {...defaultProps} savedSearch="Rick" />);

    const inputElement = screen.getByPlaceholderText('Look up Rick and Morty characters');

    expect(inputElement).toHaveValue('Rick');
  });

  test('displays empty string when value is empty', () => {
    render(<Search {...defaultProps} savedSearch="" />);

    const inputElement = screen.getByPlaceholderText('Look up Rick and Morty characters');

    expect(inputElement).toHaveValue('');
  });

  test('updates input when user types', async () => {
    const user = userEvent.setup();

    render(<Search {...defaultProps} />);

    const inputElement = screen.getByPlaceholderText('Look up Rick and Morty characters');

    await user.type(inputElement, 'Morty');

    expect(inputElement).toHaveValue('Morty');
  });

  test('calls onSearch callback with input value when user clicks search button', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();

    render(<Search {...defaultProps} onSearch={onSearch} />);

    const inputElement = screen.getByPlaceholderText('Look up Rick and Morty characters');
    const searchButton = screen.getByRole('button', { name: /search/i });

    await user.type(inputElement, 'Summer');
    await user.click(searchButton);

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('Summer');
  });

  test('calls onSearch callback with input value when user presses Enter', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<Search {...defaultProps} onSearch={onSearch} />);

    const inputElement = screen.getByPlaceholderText('Look up Rick and Morty characters');

    await user.type(inputElement, 'Summer');
    await user.keyboard('{Enter}');

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('Summer');
  });
});
