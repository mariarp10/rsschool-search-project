import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type MockInstance } from 'vitest';
import { ErrorThrowerComponent } from './error-thrower';

describe(`Error Thrower Component`, () => {
  let consoleError: MockInstance<() => void>;

  beforeEach(() => {
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  test(`shows crash button to initiate error throw`, () => {
    render(<ErrorThrowerComponent />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test(`throws error when button is clicked`, async () => {
    const user = userEvent.setup();

    render(<ErrorThrowerComponent />);

    const button = screen.getByRole('button', { name: 'Test ErrorBoundary' });

    await expect(user.click(button)).rejects.toThrow('Test error');
  });
});
