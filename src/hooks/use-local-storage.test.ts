import { renderHook } from '@testing-library/react';
import { useLocalStorage } from './use-local-storage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  test('returns value from localStorage', () => {
    localStorage.setItem('lastSearch', 'rick');
    const { result } = renderHook(() => useLocalStorage('lastSearch'));
    expect(result.current.getValue()).toBe('rick');
  });

  test('returns empty string when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('lastSearch'));
    expect(result.current.getValue()).toBe('');
  });

  test('saves value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('lastSearch'));
    result.current.setValue('beth');
    expect(localStorage.getItem('lastSearch')).toBe('beth');
  });

  test('overwrites previous value', () => {
    const { result } = renderHook(() => useLocalStorage('lastSearch'));
    result.current.setValue('summer');
    result.current.setValue('morty');
    expect(localStorage.getItem('lastSearch')).toBe('morty');
  });

  test('saves empty string', () => {
    const { result } = renderHook(() => useLocalStorage('lastSearch'));
    result.current.setValue('');
    expect(localStorage.getItem('lastSearch')).toBe('');
  });
});
