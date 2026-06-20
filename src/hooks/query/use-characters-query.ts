import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getCharacters } from '@utils/api';
import type { ApiError } from '@utils/api-error';
import { queryKeys } from '@utils/query-keys';
import type { CharacterResponse } from '@utils/types';

export const useCharactersQuery = (
  page: number,
  name?: string,
): UseQueryResult<CharacterResponse, ApiError> => {
  return useQuery({
    queryKey: queryKeys.characters(page, name),
    queryFn: () => getCharacters(page, name),
  });
};
