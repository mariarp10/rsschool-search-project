export const getStatusCode = (err: unknown): number => {
  if (err instanceof Response) return err.status;
  return 1;
};
