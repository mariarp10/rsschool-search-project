import React from 'react';
import type { TCharacter } from '@utils/types';
import { Search } from '@components/search';
import { Results } from '@components/results';
import { UIPagination } from '@ui/pagination';
import { getLastSearch, getStatusCode, saveLastSearch } from '@utils/helpers';
import { UIErrorNotification } from '@ui/error-notification';
import { Footer } from '@ui/footer';
import { Header } from '@ui/header/header';
import { ErrorThrower } from '@components/error-thrower';
import api from '@utils/api';

const PAGE_CHANGE_DELAY_MS = 400;

type THomePageState = {
  lastSearch: string;
  currentPage: number;
  totalPages: number;
  charactersForPage: TCharacter[];
  isLoading: boolean;
  errorCode: number | null;
};

export class HomePage extends React.Component<Record<string, never>, THomePageState> {
  pageChangeTimeoutId: ReturnType<typeof setTimeout> | null = null;

  state: THomePageState = {
    lastSearch: '',
    currentPage: 1,
    totalPages: 0,
    charactersForPage: [],
    isLoading: false,
    errorCode: null,
  };

  componentDidMount(): void {
    const lastSearch = getLastSearch();

    this.setState({ lastSearch }, () => this.loadCharacters());
  }

  componentWillUnmount(): void {
    if (this.pageChangeTimeoutId) {
      clearTimeout(this.pageChangeTimeoutId);
    }
  }

  loadCharacters = async () => {
    this.setState({ errorCode: null, isLoading: true });

    try {
      const { info, results } = this.state.lastSearch
        ? await api.getCharacters(this.state.currentPage, this.state.lastSearch)
        : await api.getCharacters(this.state.currentPage);

      this.setState({
        totalPages: info.pages,
        charactersForPage: results,
        isLoading: false,
        errorCode: null,
      });
    } catch (err) {
      this.setState((prev) => ({ currentPage: prev.currentPage - 1 }));
      this.handleError(err);
    }
  };

  handleError = (err: unknown) => {
    this.setState({
      isLoading: false,
      errorCode: getStatusCode(err),
    });

    if (!(err instanceof TypeError)) {
      this.setState({ charactersForPage: [], currentPage: 1, totalPages: 0 });
    }
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
      this.setState({ currentPage: page }, () => {
        this.loadCharacters();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.pageChangeTimeoutId = null;
      });
    }, PAGE_CHANGE_DELAY_MS);
  };

  handleSearch = (userInput: string) => {
    const trimmedSearch = userInput.trim().toLowerCase();
    const { lastSearch, isLoading } = this.state;

    if (isLoading || trimmedSearch === lastSearch) {
      return;
    }

    saveLastSearch(trimmedSearch);

    this.setState({ lastSearch: trimmedSearch, currentPage: 1 }, () => {
      this.loadCharacters();
    });
  };

  render(): React.ReactNode {
    const { lastSearch, charactersForPage, currentPage, totalPages, isLoading, errorCode } =
      this.state;

    return (
      <>
        <Header />
        <main style={{ paddingInline: '100px' }}>
          <Search initialValue={lastSearch} onSearch={this.handleSearch} />
          {errorCode && errorCode !== 1 ? (
            <UIErrorNotification errorCode={errorCode} />
          ) : (
            <>
              {errorCode === 1 && <UIErrorNotification errorCode={errorCode} />}
              {totalPages > 1 && (
                <UIPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  isLoading={isLoading}
                  handleNextPage={this.handleNextPage}
                  handlePreviousPage={this.handlePreviousPage}
                />
              )}
              <Results characters={charactersForPage} isLoading={isLoading} />
            </>
          )}
          <ErrorThrower />
        </main>
        <Footer />
      </>
    );
  }
}
