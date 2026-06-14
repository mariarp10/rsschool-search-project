import {
  Component,
  type ErrorInfo,
  type PropsWithChildren,
  type ReactNode,
} from 'react';

type ErrorBoundaryState = { hasError: boolean };

export class ErrorBoundary extends Component<
  PropsWithChildren,
  ErrorBoundaryState
> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError() {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <>
          <p>
            The thrown error has been successfully caught. Please reload the
            page to continue using the app.
          </p>
          <button onClick={() => globalThis.location.reload()}>
            Reload page
          </button>
        </>
      );
    }

    return this.props.children;
  }
}
