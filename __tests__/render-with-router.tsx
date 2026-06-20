import { render, type RenderOptions } from '@testing-library/react';
import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import {
  QueryClient,
  QueryClientProvider,
  type DefaultOptions,
} from '@tanstack/react-query';

import { routeTree } from '../src/routeTree.gen';

type RenderWithRouterOptions = Omit<RenderOptions, 'wrapper'> & {
  initialLocation?: string;
  queryOptions?: DefaultOptions;
};

const createTestQueryClient = (queryOptions?: DefaultOptions): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
        refetchOnWindowFocus: false,
        ...queryOptions?.queries,
      },
    },
  });

export function renderWithRouter({
  initialLocation = '/characters?page=1',
  queryOptions,
  ...renderOptions
}: RenderWithRouterOptions = {}) {
  const queryClient = createTestQueryClient(queryOptions);

  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: [initialLocation],
    }),
  });

  return {
    router,
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
      renderOptions,
    ),
  };
}
