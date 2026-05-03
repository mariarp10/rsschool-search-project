export const getLastSearch = () => {
  return localStorage.getItem('lastSearch') ?? '';
};

export const saveLastSearch = (value: string) => {
  localStorage.setItem('lastSearch', value);
};

export const getStatusCode = (err: unknown): number => {
  return err instanceof Response ? err.status : 429;
};
