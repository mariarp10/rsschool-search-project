import { createContext, useContext } from 'react';

export type Theme = 'light' | 'dark';

export const ThemeContext = createContext<Theme>('dark');
export const ThemeUpdateContext = createContext<() => void>(() => {
  // noop
});

export const useTheme = (): Theme => useContext(ThemeContext);
export const useToggleTheme = (): (() => void) =>
  useContext(ThemeUpdateContext);
