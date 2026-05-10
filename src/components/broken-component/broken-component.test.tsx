import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrokenComponent } from './broken-component';

describe(`Broken Component`, () => {
  test(`shows crash button to initiate error throw`, () => {
    render(<BrokenComponent />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  test(`throws error when button is clicked`, async () => {
    const user = userEvent.setup();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<BrokenComponent />);

    const button = screen.getByRole('button', { name: 'Crash the app' });

    await expect(user.click(button)).rejects.toThrow('Test error');

    consoleError.mockRestore();
  });
});
