import { getLastSearch, saveLastSearch } from './helpers';

describe('localStorage functionality', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('returns value from localStorage', () => {
    localStorage.setItem('lastSearch', 'rick');
    expect(getLastSearch()).toBe('rick');
  });
  test('returns empty string when localStorage is empty', () => {
    localStorage.clear();
    expect(getLastSearch()).toBe('');
  });

  test('saves value to localStorage', () => {
    saveLastSearch('beth');
    expect(localStorage.getItem('lastSearch')).toBe('beth');
  });

  test('overwrites previous value', () => {
    saveLastSearch('summer');
    saveLastSearch('morty');

    expect(localStorage.getItem('lastSearch')).toBe('morty');
  });

  test('saves empty string', () => {
    saveLastSearch('');
    expect(localStorage.getItem('lastSearch')).toBe('');
  });
});
