import React from 'react';
import type { TCharacter } from '@utils/types';
import { SearchField } from '@components/search-field';
import { ResultsBlock } from '@components/results-block';
import { getLastSearch, getStatusCode, saveLastSearch } from '@utils/helpers';
import api from '@utils/api';

type SearchState = {
  lastSearch: string;
  currentPage: number;
  totalPages: number;
  characters: TCharacter[];
  isLoading: boolean;
  errorCode: number | null;
};

export class SearchResultsPage extends React.Component<Record<string, never>, SearchState> {
  state: SearchState = {
    lastSearch: '',
    currentPage: 1,
    totalPages: 0,
    characters: [],
    isLoading: false,
    errorCode: null,
  };

  componentDidMount() {
    const lastSearch = getLastSearch();

    this.setState({ lastSearch });
    this.loadCharacters(1, lastSearch);
  }

  loadCharacters = async (page: number, searchTerm: string) => {
    this.setState({ isLoading: true, errorCode: null });

    try {
      const data = searchTerm
        ? await api.getCharacterByName(page, searchTerm)
        : await api.getAllCharacters(page);

      this.setState({
        characters: data.results,
        totalPages: data.info.pages,
        currentPage: page,
        isLoading: false,
      });
    } catch (err: unknown) {
      this.handleError(err);
    }
  };

  handleError = (err: unknown) => {
    this.setState({
      characters: [],
      totalPages: 0,
      isLoading: false,
      errorCode: getStatusCode(err),
    });
  };

  handleNextPage = () => {
    const { currentPage, totalPages, lastSearch, isLoading } = this.state;

    if (isLoading || currentPage >= totalPages) {
      return;
    }

    this.loadCharacters(currentPage + 1, lastSearch);
  };

  handlePreviousPage = () => {
    const { currentPage, lastSearch, isLoading } = this.state;

    if (isLoading || currentPage <= 1) {
      return;
    }

    this.loadCharacters(currentPage - 1, lastSearch);
  };

  handleSearch = (userInput: string) => {
    const trimmedSearch = userInput.trim().toLowerCase();
    const { lastSearch, isLoading } = this.state;

    if (isLoading || trimmedSearch === lastSearch) {
      return;
    }

    saveLastSearch(trimmedSearch);

    this.setState({ lastSearch: trimmedSearch }, () => {
      this.loadCharacters(1, trimmedSearch);
    });
  };

  render(): React.ReactNode {
    const { lastSearch, characters, currentPage, totalPages, isLoading, errorCode } = this.state;

    return (
      <>
        <SearchField initialValue={lastSearch} onSearch={this.handleSearch} />

        <ResultsBlock
          characters={characters}
          currentPage={currentPage}
          totalPages={totalPages}
          isLoading={isLoading}
          errorCode={errorCode}
          handlePreviousPage={this.handlePreviousPage}
          handleNextPage={this.handleNextPage}
        />
      </>
    );
  }
}
