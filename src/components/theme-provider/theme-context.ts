import { createContext, useContext } from 'react';

export type TTheme = 'light' | 'dark';

export const ThemeContext = createContext<TTheme>('dark');
export const ThemeUpdateContext = createContext<() => void>(() => {});

export const useTheme = () => useContext(ThemeContext);
export const useToggleTheme = () => useContext(ThemeUpdateContext);
