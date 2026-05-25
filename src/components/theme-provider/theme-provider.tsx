import React, { useState, useEffect } from 'react';
import { ThemeContext, ThemeUpdateContext, type TTheme } from './theme-context';

type TThemeProps = {
  children: React.ReactNode;
};

export const ThemeProvider: React.FC<TThemeProps> = ({ children }) => {
  const [theme, setTheme] = useState<TTheme>('dark');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={theme}>
      <ThemeUpdateContext.Provider value={toggleTheme}>{children}</ThemeUpdateContext.Provider>
    </ThemeContext.Provider>
  );
};
