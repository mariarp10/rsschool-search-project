import React from 'react';
import { SearchField } from '@components/search-field';
import { ResultsBlock } from '@components/results-block';
import api from '@utils/api';
import type { TCharacter } from '@utils/types';
import { ErrorBoundary } from '@components/error-boundary';
import { BrokenComponent } from '@components/broken-component';

type AppState = {
  lastSearch: string;
  currentPage: number;
  totalPages: number;
  characters: TCharacter[];
  isLoading: boolean;
  statusCode: number | null;
};
class App extends React.Component<Record<string, never>, AppState> {
  state: AppState = {
    lastSearch: '',
    currentPage: 1,
    totalPages: 0,
    characters: [],
    isLoading: false,
    statusCode: null,
  };

  getStatusCode(err) {
    return err instanceof Response ? err.status : 429;
  }

  loadAllCharacters = async (page: number) => {
    this.setState({ isLoading: true, statusCode: null });

    try {
      const data = await api.getAllCharacters(page);

      this.setState({
        characters: data.results,
        totalPages: data.info.pages,
        isLoading: false,
      });
    } catch (err: unknown) {
      const statusCode = this.getStatusCode(err);
      this.setState({
        isLoading: false,
        statusCode,
      });
    }
  };

  handleNextPage = () => {
    const nextPage = this.state.currentPage + 1;

    if (nextPage > this.state.totalPages) {
      return;
    }

    this.setState({ currentPage: nextPage });

    if (this.state.lastSearch) {
      this.searchCharacterByName(nextPage, this.state.lastSearch);
    } else {
      this.loadAllCharacters(nextPage);
    }
  };

  handlePreviousPage = () => {
    const previousPage = this.state.currentPage - 1;

    if (previousPage < 1) {
      return;
    }

    this.setState({ currentPage: previousPage });

    if (this.state.lastSearch) {
      this.searchCharacterByName(previousPage, this.state.lastSearch);
    } else {
      this.loadAllCharacters(previousPage);
    }
  };

  handleSearch = async (userInput: string) => {
    const trimmedSearch = userInput.trim().toLowerCase();
    const savedSearch = localStorage.getItem('lastSearch');

    if (trimmedSearch === savedSearch) {
      return;
    }

    localStorage.setItem('lastSearch', trimmedSearch);
    this.setState({ lastSearch: trimmedSearch, currentPage: 1 });
    this.searchCharacterByName(1, trimmedSearch);
  };

  searchCharacterByName = async (page: number, name: string) => {
    this.setState({ isLoading: true, statusCode: null });

    try {
      const data = await api.getCharacterByName(page, name);

      this.setState({
        characters: data.results,
        totalPages: data.info.pages,
        isLoading: false,
      });
    } catch (err: unknown) {
      const statusCode = this.getStatusCode(err);

      this.setState({
        isLoading: false,
        statusCode,
      });
    }
  };

  componentDidMount() {
    const lastSearch = localStorage.getItem('lastSearch');

    if (lastSearch !== null) {
      this.setState({ lastSearch });
      this.searchCharacterByName(1, lastSearch);
    } else {
      this.loadAllCharacters(1);
    }
  }

  render() {
    return (
      <>
        <ErrorBoundary>
          <div>
            <h1>Rick and Morty: search characters</h1>
            <SearchField initialValue={this.state.lastSearch} onSearch={this.handleSearch} />
          </div>
          <ResultsBlock
            characters={this.state.characters}
            currentPage={this.state.currentPage}
            totalPages={this.state.totalPages}
            isLoading={this.state.isLoading}
            handlePreviousPage={this.handlePreviousPage}
            handleNextPage={this.handleNextPage}
          />
          <BrokenComponent />
        </ErrorBoundary>
      </>
    );
  }
}

export default App;
