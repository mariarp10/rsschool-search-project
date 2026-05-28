import { useCallback } from 'react';

export const useLocalStorage = (key: string, defaultValue: string = '') => {
  const getValue = useCallback(() => {
    try {
      return localStorage.getItem(key) ?? defaultValue;
    } catch {
      return defaultValue;
    }
  }, [key, defaultValue]);

  const setValue = useCallback(
    (value: string, defaultValue: string = '') => {
      try {
        localStorage.setItem(key, value);
      } catch {
        return defaultValue;
      }
    },
    [key]
  );

  return { getValue, setValue };
};
