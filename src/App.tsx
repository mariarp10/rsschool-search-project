import React from 'react';
import { SearchField } from '@components/search-field';
import { ResultsBlock } from '@components/results-block';

type AppState = {
  searchTerm: string;
};
class App extends React.Component<Record<string, never>, AppState> {
  state: AppState = {
    searchTerm: '',
  };

  componentDidMount() {
    const lastSearchTerm = localStorage.getItem('searchTerm');

    if (lastSearchTerm !== null) {
      this.setState({ searchTerm: lastSearchTerm });
    }
  }

  handleSearch = (userInput: string) => {
    const trimmedSearch = userInput.trim();

    if (trimmedSearch === this.state.searchTerm) {
      return;
    }

    localStorage.setItem('searchTerm', trimmedSearch);
    this.setState({ searchTerm: trimmedSearch });
  };

  render() {
    return (
      <>
        <div>
          <h1>Rick and Morty: search characters</h1>
          <SearchField initialValue={this.state.searchTerm} onSearch={this.handleSearch} />
        </div>
        <ResultsBlock searchTerm={this.state.searchTerm}></ResultsBlock>
      </>
    );
  }
}

export default App;
