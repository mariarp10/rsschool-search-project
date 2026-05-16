import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type MockInstance } from 'vitest';
import { ErrorThrower } from './error-thrower';

describe(`Error Thrower Component`, () => {
  let consoleError: MockInstance<() => void>;

  beforeEach(() => {
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  test(`shows test button to initiate error throw`, () => {
    render(<ErrorThrower />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test(`throws error when button is clicked`, async () => {
    const user = userEvent.setup();

    render(<ErrorThrower />);

    const button = screen.getByRole('button', { name: 'Test Error' });

    await expect(user.click(button)).rejects.toThrow('Test error');
  });
});
