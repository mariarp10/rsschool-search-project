import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { Search } from './search';

const defaultProps = {
  value: '',
  onChange: vi.fn(),
  onSearch: vi.fn(),
};

const renderControlledSearch = (onSearch = vi.fn()) => {
  const ControlledSearch = () => {
    const [value, setValue] = useState('');

    return <Search value={value} onChange={setValue} onSearch={onSearch} />;
  };

  render(<ControlledSearch />);

  return {
    onSearch,
  };
};

describe('Search Component', () => {
  test('renders input, search button, and hint', () => {
    render(<Search {...defaultProps} />);

    const inputElement = screen.getByPlaceholderText(
      'Look up Rick and Morty characters'
    );
    const searchButton = screen.getByRole('button', { name: /search/i });
    const hintElement = screen.getByText(
      'Try typing in names of the characters from the show: Summer, Beth, Rick'
    );

    expect(inputElement).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
    expect(hintElement).toBeInTheDocument();
  });

  test('displays value from props', () => {
    render(<Search {...defaultProps} value="Rick" />);

    const inputElement = screen.getByPlaceholderText(
      'Look up Rick and Morty characters'
    );

    expect(inputElement).toHaveValue('Rick');
  });

  test('displays empty string when value is empty', () => {
    render(<Search {...defaultProps} value="" />);

    const inputElement = screen.getByPlaceholderText(
      'Look up Rick and Morty characters'
    );

    expect(inputElement).toHaveValue('');
  });

  test('calls onChange when user types', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Search {...defaultProps} value="" onChange={handleChange} />);

    const inputElement = screen.getByPlaceholderText(
      'Look up Rick and Morty characters'
    );

    await user.type(inputElement, 'Morty');

    expect(handleChange).toHaveBeenCalled();
    expect(handleChange).toHaveBeenLastCalledWith('y');
  });

  test('updates input value when parent updates value', async () => {
    const user = userEvent.setup();

    renderControlledSearch();

    const inputElement = screen.getByPlaceholderText(
      'Look up Rick and Morty characters'
    );

    await user.type(inputElement, 'Morty');

    expect(inputElement).toHaveValue('Morty');
  });

  test('calls onSearch callback with input value when user clicks search button', async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn();

    renderControlledSearch(handleSearch);

    const inputElement = screen.getByPlaceholderText(
      'Look up Rick and Morty characters'
    );
    const searchButton = screen.getByRole('button', { name: /search/i });

    await user.type(inputElement, 'Summer');
    await user.click(searchButton);

    expect(handleSearch).toHaveBeenCalledTimes(1);
    expect(handleSearch).toHaveBeenCalledWith('Summer');
  });

  test('calls onSearch callback with input value when user presses Enter', async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn();

    renderControlledSearch(handleSearch);

    const inputElement = screen.getByPlaceholderText(
      'Look up Rick and Morty characters'
    );

    await user.type(inputElement, 'Summer');
    await user.keyboard('{Enter}');

    expect(handleSearch).toHaveBeenCalledTimes(1);
    expect(handleSearch).toHaveBeenCalledWith('Summer');
  });

  test('updates input value when value prop changes', () => {
    const { rerender } = render(<Search {...defaultProps} value="Rick" />);

    const inputElement = screen.getByPlaceholderText(
      'Look up Rick and Morty characters'
    );

    expect(inputElement).toHaveValue('Rick');

    rerender(<Search {...defaultProps} value="Morty" />);

    expect(inputElement).toHaveValue('Morty');
  });
});
