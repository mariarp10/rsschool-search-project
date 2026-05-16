import React from 'react';
import { HomePage } from '@pages/home';
import { ErrorBoundary } from '@components/error-boundary';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <HomePage />
    </ErrorBoundary>
  );
};

export default App;
