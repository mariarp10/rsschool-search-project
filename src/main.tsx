import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApiError } from '@utils/api-error';

// 1 day
const cacheTime = Number(import.meta.env.VITE_CACHE_TTL_MS) || 24 * 60 * 60 * 1000;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: cacheTime,
      gcTime: cacheTime,
      retry: (failureCount, error) => {
        if (error instanceof TypeError) {
          return failureCount < 5;
        }

        if (error instanceof ApiError) {
          return error.status >= 500 && failureCount < 2;
        }

        return false;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    },
  },
});

const router = createRouter({
  routeTree,
});
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
