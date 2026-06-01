import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';

type UseLocalStorageReturnType = [
  value: string,
  setValue: Dispatch<SetStateAction<string>>,
];

export const useLocalStorage = (
  key: string,
  defaultValue = '',
): UseLocalStorageReturnType => {
  const [lastSearch, setLastSearch] = useState<string>(() => {
    try {
      const value = localStorage.getItem(key);

      if (!value) {
        return defaultValue;
      }

      const parsedValue: unknown = JSON.parse(value);

      return typeof parsedValue === 'string' ? parsedValue : defaultValue;
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
