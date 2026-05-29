import {
  Component,
  type ErrorInfo,
  type PropsWithChildren,
  type ReactNode,
} from 'react';

type TErrorBoundaryState = { hasError: boolean };

export class ErrorBoundary extends Component<
  PropsWithChildren,
  TErrorBoundaryState
> {
  state: TErrorBoundaryState = { hasError: false };

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
