import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from './error-boundary';

const ThrowError = () => {
  throw new Error('Test error');
};

describe(`ErrorBoundry Component`, () => {
  test(`renders children when there's no error`, () => {
    render(
      <ErrorBoundary>
        <p>Example child node</p>
      </ErrorBoundary>,
    );

    expect(screen.getByText('Example child node')).toBeInTheDocument();
  });
  test(`renders fallback UI when child throws error`, async () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const reload = vi.fn();
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      reload,
    });

    const user = userEvent.setup();

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    const reloadButton = screen.getByRole('button', { name: 'Reload page' });

    expect(
      screen.getByText(
        'The thrown error has been successfully caught by the ErrorBoundary',
      ),
    ).toBeInTheDocument();
    expect(reloadButton).toBeInTheDocument();

    await user.click(reloadButton);

    expect(reload).toHaveBeenCalledTimes(1);

    consoleError.mockRestore();
  });
});
