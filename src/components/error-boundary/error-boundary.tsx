import React from 'react';

type State = { hasError: boolean };

export class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <p>The app has crashed</p>
          <button onClick={() => window.location.reload()}>Reload page</button>
        </>
      );
    }

    return this.props.children;
  }
}
