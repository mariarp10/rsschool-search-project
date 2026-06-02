import { useCallback } from 'react';

type UseLocalStorageReturn = {
  getValue: () => string;
  setValue: (value: string, defaultValue?: string) => void;
};

export const useLocalStorage = (
  key: string,
  defaultValue = '',
): UseLocalStorageReturn => {
  const getValue = useCallback(() => {
    try {
      return localStorage.getItem(key) ?? defaultValue;
    } catch {
      return defaultValue;
    }
  }, [key, defaultValue]);

  const setValue = useCallback(
    (value: string, defaultValue = '') => {
      try {
        localStorage.setItem(key, value);
      } catch {
        return defaultValue;
      }
    },
    [key],
  );

  return { getValue, setValue };
};
