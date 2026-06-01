import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { UIThemeControls } from './theme-controls';
import { ThemeProvider } from '@components/theme-provider/theme-provider';

vi.mock('@assets/icons/moon-icon', () => ({
  MoonIcon: () => <svg data-testid="moon-icon" />,
}));

vi.mock('@assets/icons/sun-icon', () => ({
  SunIcon: () => <svg data-testid="sun-icon" />,
}));

describe('UIThemeControls', () => {
  test('renders moon icon for dark theme by default', () => {
    render(
      <ThemeProvider>
        <UIThemeControls />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('sun-icon')).not.toBeInTheDocument();
  });

  test('changes icon when theme is toggled', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <UIThemeControls />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();

    await user.click(screen.getByRole('button'));

    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('moon-icon')).not.toBeInTheDocument();
  });
});
