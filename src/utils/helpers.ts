export const getLastSearch = () => {
  return localStorage.getItem('lastSearch') ?? '';
};

export const saveLastSearch = (value: string) => {
  localStorage.setItem('lastSearch', value);
};

export const getStatusCode = (err: unknown): number => {
  if (err instanceof Response) return err.status;
  if ('status' in (err as object)) return (err as { status: number }).status;
  return 1;
};
