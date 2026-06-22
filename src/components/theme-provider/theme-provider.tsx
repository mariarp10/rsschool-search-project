'use client';

import { type ReactNode, useState, useEffect } from 'react';
import { ThemeContext, type Theme } from './theme-context';

type ThemeProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProps) => {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
