import { render, type RenderOptions } from '@testing-library/react';
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router';

import { routeTree } from '../src/routeTree.gen';

type RenderWithRouterOptions = Omit<RenderOptions, 'wrapper'> & {
  initialLocation?: string;
};

export function renderWithRouter({
  initialLocation = '/characters?page=1',
  ...renderOptions
}: RenderWithRouterOptions = {}) {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: [initialLocation],
    }),
  });

  return {
    router,
    ...render(<RouterProvider router={router} />, renderOptions),
  };
}
