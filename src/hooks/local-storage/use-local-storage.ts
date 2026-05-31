import { useState, useEffect } from 'react';

export const useLocalStorage = (key: string, defaultValue: string = '') => {
  const [lastSearch, setLastSearch] = useState(() => {
    try {
      const value = localStorage.getItem(key);

      return value ? JSON.parse(value) : defaultValue;
    } catch {
      console.error('A problem occured when retrieving data from localStorage');
      return defaultValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(lastSearch));
  }, [key, lastSearch]);

  return [lastSearch, setLastSearch];
};
