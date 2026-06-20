import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  ThemeContext,
  type Theme,
} from '@components/theme-provider/theme-context';
import { ThemeControls } from './theme-controls';

type RenderThemeControlsOptions = {
  theme?: Theme;
  toggleTheme?: () => void;
};

const renderThemeControls = ({
  theme = 'dark',
  toggleTheme = vi.fn(),
}: RenderThemeControlsOptions = {}) => {
  return render(
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ThemeControls />
    </ThemeContext.Provider>,
  );
};

describe('ThemeControls', () => {
  it('renders theme toggle button', () => {
    renderThemeControls();

    expect(
      screen.getByRole('button', { name: 'Toggle theme' }),
    ).toBeInTheDocument();
  });

  it('calls toggleTheme when button is clicked', async (): Promise<void> => {
    const user = userEvent.setup();
    const toggleThemeMock = vi.fn();

    renderThemeControls({
      toggleTheme: toggleThemeMock,
    });

    await user.click(screen.getByRole('button', { name: 'Toggle theme' }));

    expect(toggleThemeMock).toHaveBeenCalledTimes(1);
  });
});
