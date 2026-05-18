import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Header } from '@ui/header/header';
import { Footer } from '@ui/footer/footer';
import { ErrorBoundary } from '@components/error-boundary';
import { NotFoundPage } from '@pages/not-found';

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundPage,
});

function RootComponent() {
  return (
    <ErrorBoundary>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <TanStackRouterDevtools position="bottom-right" />
    </ErrorBoundary>
  );
}
