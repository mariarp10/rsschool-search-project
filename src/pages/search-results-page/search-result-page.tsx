import React from 'react';
import type { TCharacter } from '@utils/types';
import { SearchField } from '@components/search-field';
import { ResultsBlock } from '@components/results-block';
import { UIPagination } from '@ui/pagination';
import { getLastSearch, getStatusCode, saveLastSearch } from '@utils/helpers';
import { UIErrorNotification } from '@ui/error-notification';
import { Footer } from '@ui/footer';
import api from '@utils/api';

const PAGE_CHANGE_DELAY_MS = 400;

type SearchState = {
  lastSearch: string;
  currentPage: number;
  totalPages: number;
  charactersForPage: TCharacter[];
  isLoading: boolean;
  errorCode: number | null;
};

export class SearchResultsPage extends React.Component<Record<string, never>, SearchState> {
  pageChangeTimeoutId: ReturnType<typeof setTimeout> | null = null;

  state: SearchState = {
    lastSearch: '',
    currentPage: 1,
    totalPages: 0,
    charactersForPage: [],
    isLoading: false,
    errorCode: null,
  };

  componentDidMount(): void {
    const lastSearch = getLastSearch();

    this.setState({ lastSearch });
    this.loadCharacters();
  }

  componentWillUnmount(): void {
    if (this.pageChangeTimeoutId) {
      clearTimeout(this.pageChangeTimeoutId);
    }
  }

  loadCharacters = async () => {
    try {
      const { info, results } = this.state.lastSearch
        ? await api.getCharacters(this.state.currentPage, this.state.lastSearch)
        : await api.getCharacters(this.state.currentPage);

      this.setState({
        totalPages: info.pages,
        charactersForPage: results,
      });
    } catch (err) {
      this.handleError(err);
    }
  };

  handleError = (err: unknown) => {
    this.setState({
      isLoading: false,
      errorCode: getStatusCode(err),
    });
  };

  handleNextPage = () => {
    const { currentPage } = this.state;

    this.changePage(currentPage + 1);
  };

  handlePreviousPage = () => {
    const { currentPage } = this.state;

    this.changePage(currentPage - 1);
  };

  changePage = (page: number) => {
    this.setState({ isLoading: true });

    this.pageChangeTimeoutId = setTimeout(() => {
      this.loadCharacters();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.pageChangeTimeoutId = null;
      this.setState({ isLoading: false, currentPage: page });
    }, PAGE_CHANGE_DELAY_MS);
  };

  handleSearch = (userInput: string) => {
    const trimmedSearch = userInput.trim().toLowerCase();
    const { lastSearch, isLoading } = this.state;

    if (this.state.errorCode) {
      this.setState({ errorCode: null });
    }

    if (isLoading || trimmedSearch === lastSearch) {
      return;
    }

    saveLastSearch(trimmedSearch);

    this.setState({ lastSearch: trimmedSearch, currentPage: 1 }, () => {
      this.loadCharacters();
    });
  };

  handleBackToResults = () => {
    this.setState({ errorCode: null });
    this.loadCharacters();
  };

  handleBackToAllCharacters = () => {
    saveLastSearch('');

    this.setState(
      {
        lastSearch: getLastSearch(),
        currentPage: 1,
        totalPages: 0,
        charactersForPage: [],
        errorCode: null,
      },
      () => {
        this.loadCharacters();
      },
    );
  };

  render(): React.ReactNode {
    const { lastSearch, charactersForPage, currentPage, totalPages, isLoading } = this.state;

    return (
      <>
        <SearchField initialValue={lastSearch} onSearch={this.handleSearch} />
        {this.state.errorCode ? (
          <UIErrorNotification
            handleAllCharacters={this.handleBackToAllCharacters}
            handleBackToResults={this.handleBackToResults}
            errorCode={this.state.errorCode}
          />
        ) : (
          <>
            <ResultsBlock characters={charactersForPage} isLoading={isLoading} />
            {totalPages > 1 && (
              <UIPagination
                currentPage={currentPage}
                totalPages={totalPages}
                isLoading={isLoading}
                handleNextPage={this.handleNextPage}
                handlePreviousPage={this.handlePreviousPage}
              />
            )}
          </>
        )}
        <Footer />
      </>
    );
  }
}
