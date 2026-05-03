import React from 'react';
import { SearchResultsPage } from '@pages/search-results-page';
import { ErrorBoundary } from '@components/error-boundary';
import { BrokenComponent } from '@components/broken-component';
class App extends React.Component {
  render(): React.ReactNode {
    return (
      <ErrorBoundary>
        <SearchResultsPage />
        <BrokenComponent />
      </ErrorBoundary>
    );
  }
}

export default App;
