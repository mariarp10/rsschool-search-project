import { createContext, useContext } from 'react';

export type TTheme = 'light' | 'dark';

const throwMissingThemeProviderError = (): never => {
  throw new Error('useToggleTheme must be used within ThemeProvider');
};

export const ThemeContext = createContext<TTheme>('dark');

export const ThemeUpdateContext = createContext<() => void>(
  throwMissingThemeProviderError,
);

export const useTheme = (): TTheme => {
  return useContext(ThemeContext);
};

export const useToggleTheme = (): (() => void) => {
  return useContext(ThemeUpdateContext);
};
