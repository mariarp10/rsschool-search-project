import { type FC, type ReactNode, useState, useEffect } from 'react';
import { ThemeContext, ThemeUpdateContext, type Theme } from './theme-context';

type ThemeProps = {
  children: ReactNode;
};

export const ThemeProvider: FC<ThemeProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={theme}>
      <ThemeUpdateContext.Provider value={toggleTheme}>
        {children}
      </ThemeUpdateContext.Provider>
    </ThemeContext.Provider>
  );
};
