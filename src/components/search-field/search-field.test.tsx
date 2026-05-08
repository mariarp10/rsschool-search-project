import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchField } from './search-field';

describe('SearchField Component', () => {
  //passed
  test(`renders input, search button, and hint`, () => {
    render(<SearchField initialValue="" onSearch={vi.fn()} />);

    const inputElement = screen.getByPlaceholderText('Look up Rick and Morty characters');
    const searchButton = screen.getByRole('button', { name: /search/i });
    const hintElement = screen.getByText(
      'Try typing in names of the characters from the show: Summer, Beth, Rick',
    );

    expect(inputElement).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
    expect(hintElement).toBeInTheDocument();
  });
  //passed
  test(`displays initial value from props`, () => {
    render(<SearchField initialValue="Rick" onSearch={vi.fn()} />);

    const inputElement = screen.getByPlaceholderText('Look up Rick and Morty characters');

    expect(inputElement).toHaveValue('Rick');
  });
  // passed
  test(`displays empty string when initial value is empty`, () => {
    render(<SearchField initialValue="" onSearch={vi.fn()} />);

    const inputElement = screen.getByPlaceholderText('Look up Rick and Morty characters');

    expect(inputElement).toHaveValue('');
  });
  // passed
  test(`updates input value when user types`, async () => {
    const user = userEvent.setup();

    render(<SearchField initialValue="" onSearch={vi.fn()} />);

    const inputElement = screen.getByPlaceholderText('Look up Rick and Morty characters');

    await user.type(inputElement, 'Morty');

    expect(inputElement).toHaveValue('Morty');
  });
  // passed
  test(`calls onSearch callback with input value when user clicks search button`, async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn();

    render(<SearchField initialValue="" onSearch={handleSearch} />);

    const inputElement = screen.getByPlaceholderText('Look up Rick and Morty characters');
    const searchButton = screen.getByRole('button', { name: /search/i });

    await user.type(inputElement, 'Summer');
    await user.click(searchButton);

    expect(handleSearch).toHaveBeenCalledTimes(1);
    expect(handleSearch).toHaveBeenCalledWith('Summer');
  });
  test(`calls onSearch callback with input value when user presses Enter`, async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn();

    render(<SearchField initialValue="" onSearch={handleSearch} />);

    const inputElement = screen.getByPlaceholderText('Look up Rick and Morty characters');

    await user.type(inputElement, 'Summer');
    await user.keyboard('{Enter}');

    expect(handleSearch).toHaveBeenCalledTimes(1);
    expect(handleSearch).toHaveBeenCalledWith('Summer');
  });
  test(`updates input value when initialValue prop changes`, () => {
    const { rerender } = render(<SearchField initialValue="Rick" onSearch={vi.fn()} />);

    const inputElement = screen.getByPlaceholderText('Look up Rick and Morty characters');

    expect(inputElement).toHaveValue('Rick');

    rerender(<SearchField initialValue="Morty" onSearch={vi.fn()} />);

    expect(inputElement).toHaveValue('Morty');
  });
});
