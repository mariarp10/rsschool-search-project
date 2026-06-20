import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApiError } from '@utils/api-error';

const HOURS = 24;
const MINUTES = 60;
const SECONDS = 60;

// 1 day
const cacheTime =
  Number(import.meta.env.VITE_CACHE_TTL_MS) || HOURS * MINUTES * SECONDS * 1000;

const retryDelay = 5000;

const maxFailures = 5;

const SERVER_ERROR_CODE = 500;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: cacheTime,
      gcTime: cacheTime,
      retry: (failureCount, error) => {
        if (error instanceof TypeError) {
          return failureCount < maxFailures;
        }

        if (error instanceof ApiError) {
          return error.status >= SERVER_ERROR_CODE && failureCount < 2;
        }

        return false;
      },
      retryDelay: (attemptIndex) =>
        Math.min(1000 * 2 ** attemptIndex, retryDelay),
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

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('rootElement not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
