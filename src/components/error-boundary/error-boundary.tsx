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
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <>
          <p>
            The thrown error has been successfully caught by the ErrorBoundary
          </p>
          <button onClick={() => window.location.reload()}>Reload page</button>
        </>
      );
    }

    return this.props.children;
  }
}
