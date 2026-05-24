import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Header } from '@ui/header/header';
import { Footer } from '@ui/footer/footer';
import { ErrorBoundary } from '@components/error-boundary';
import { NotFoundPage } from '@pages/not-found';
import { FlyAway } from '@components/fly-away';

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundPage,
});

function RootComponent() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <ErrorBoundary>
        <Header />
        <main style={{ flex: '1' }}>
          <Outlet />
        </main>
        <FlyAway />
        <Footer />
        <TanStackRouterDevtools position="bottom-right" />
      </ErrorBoundary>
    </div>
  );
}
