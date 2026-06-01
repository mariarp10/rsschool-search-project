import React from 'react';

type TErrorBoundaryState = { hasError: boolean };

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren,
  TErrorBoundaryState
> {
  state: TErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(error, info.componentStack);
  }

  render(): React.ReactNode {
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
