import React from 'react';
import { SearchResultsPage } from '@pages/search-results-page';
import { ErrorBoundary } from '@components/error-boundary';
import { BrokenComponent } from '@components/broken-component';
import styles from './App.module.css';
class App extends React.Component {
  render(): React.ReactNode {
    return (
      <div className={styles.app}>
        <ErrorBoundary>
          <SearchResultsPage />
          <BrokenComponent />
        </ErrorBoundary>
      </div>
    );
  }
}

export default App;
