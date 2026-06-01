import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getDetails } from '@utils/api';
import type { ApiError } from '@utils/api-error';
import { queryKeys } from '@utils/query-keys';
import type { TCharacter } from '@utils/types';

export const useCharacterQuery = (
  id: number,
): UseQueryResult<TCharacter, ApiError> => {
  return useQuery({
    queryKey: queryKeys.characterDetails(id),
    queryFn: () => getDetails(id),
    enabled: Boolean(id),
  });
};
