import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';

type useLocalStorageReturn = [string, Dispatch<SetStateAction<string>>];

const parseString = (value: string): string | null => {
  const parsed: unknown = JSON.parse(value);

  if (typeof parsed === 'string') {
    return parsed;
  }

  return null;
};

export const useLocalStorage = (
  key: string,
  defaultValue = '',
): useLocalStorageReturn => {
  const [lastSearch, setLastSearch] = useState(() => {
    try {
      const value = localStorage.getItem(key);

      if (value === null) {
        return defaultValue;
      }

      return parseString(value) ?? defaultValue;
    } catch {
      console.error('A problem occured when retrieving data from localStorage');
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(lastSearch));
    } catch {
      console.error('Could not store data to localStorage');
    }
  }, [key, lastSearch]);

  return [lastSearch, setLastSearch];
};
