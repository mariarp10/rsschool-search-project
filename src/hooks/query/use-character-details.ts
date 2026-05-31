import { useQuery } from '@tanstack/react-query';
import { getDetails } from '@utils/api';
import { queryKeys } from '@utils/query-keys';

export const useCharacterQuery = (id: number) => {
  return useQuery({
    queryKey: queryKeys.characterDetails(id),
    queryFn: () => getDetails(id),
    enabled: Boolean(id),
  });
};
