import React from 'react';
import { HomePage } from '@pages/home';
import { ErrorBoundary } from '@components/error-boundary';
class App extends React.Component {
  render(): React.ReactNode {
    return (
      <ErrorBoundary>
        <HomePage />
      </ErrorBoundary>
    );
  }
}

export default App;
