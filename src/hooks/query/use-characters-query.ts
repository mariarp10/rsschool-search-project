import { useQuery } from '@tanstack/react-query';
import { getCharacters } from '@utils/api';
import { queryKeys } from '@utils/query-keys';

export const useCharactersQuery = (page: number, name?: string) => {
  return useQuery({
    queryKey: queryKeys.characters(page, name),
    queryFn: () => getCharacters(page, name),
  });
};
