import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './use-local-storage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  test('returns value from localStorage', () => {
    localStorage.setItem('lastSearch', JSON.stringify('rick'));
    const { result } = renderHook(() => useLocalStorage('lastSearch'));
    const [lastSearch] = result.current;
    expect(lastSearch).toBe('rick');
  });

  test('returns empty string when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('lastSearch'));
    const [lastSearch] = result.current;
    expect(lastSearch).toBe('');
  });

  test('saves value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('lastSearch'));
    const [, setLastSearch] = result.current;

    act(() => {
      setLastSearch('beth');
    });

    const [lastSearch] = result.current;
    expect(lastSearch).toBe('beth');
  });

  test('overwrites previous value', () => {
    const { result } = renderHook(() => useLocalStorage('lastSearch'));
    const [, setLastSearch] = result.current;

    act(() => {
      setLastSearch('summer');
      setLastSearch('morty');
    });

    const [lastSearch] = result.current;

    expect(lastSearch).toEqual('morty');
  });

  test('saves empty string', () => {
    const { result } = renderHook(() => useLocalStorage('lastSearch'));
    const [lastSearch, setLastSearch] = result.current;
    setLastSearch('');
    expect(lastSearch).toBe('');
  });
});
