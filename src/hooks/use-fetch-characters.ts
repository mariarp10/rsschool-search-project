import { useEffect, useRef } from 'react';

import { getCharacters } from '@utils/api';
import { ApiError } from '@utils/api-error';
import { useResultsStore } from '@store/results.store';

export const useFetchCharacters = (
  page: number,
  enabled: boolean,
  searchTerm?: string,
): void => {
  const latestRequestId = useRef(0);

  const setLoading = useResultsStore((state) => state.setLoading);
  const setResults = useResultsStore((state) => state.setResults);
  const setError = useResultsStore((state) => state.setError);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const requestId = latestRequestId.current + 1;
    latestRequestId.current = requestId;

    const fetchCharacters = async (): Promise<void> => {
      setLoading();

      try {
        const response = await getCharacters(page, searchTerm);

        if (requestId !== latestRequestId.current) {
          return;
        }

        setResults(response.results, response.info.pages);
      } catch (error) {
        if (requestId !== latestRequestId.current) {
          return;
        }

        setError(error instanceof ApiError ? error.status : null);
      }
    };

    void fetchCharacters();
  }, [page, searchTerm, setLoading, setResults, setError, enabled]);
};
