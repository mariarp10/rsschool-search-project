import React from 'react';
import type { TCharacter } from '@utils/types';
import { SearchField } from '@components/search-field';
import { ResultsBlock } from '@components/results-block';
import { getLastSearch, getStatusCode, saveLastSearch } from '@utils/helpers';

const ITEMS_PER_PAGE = 20;
const CHARACTERS_JSON_PATH = '/all-characters.json';
const PAGE_CHANGE_DELAY_MS = 400;

type SearchState = {
  lastSearch: string;
  currentPage: number;
  totalPages: number;
  allCharacters: TCharacter[];
  filteredCharacters: TCharacter[];
  charactersForPage: TCharacter[];
  isLoading: boolean;
  errorCode: number | null;
  isEmpty: boolean;
};

export class SearchResultsPage extends React.Component<Record<string, never>, SearchState> {
  pageChangeTimeoutId: ReturnType<typeof setTimeout> | null = null;

  state: SearchState = {
    lastSearch: '',
    currentPage: 1,
    totalPages: 0,
    allCharacters: [],
    filteredCharacters: [],
    charactersForPage: [],
    isLoading: false,
    errorCode: null,
    isEmpty: false,
  };

  componentDidMount(): void {
    const lastSearch = getLastSearch();

    this.setState({ lastSearch });
    this.loadCharactersFromJson(lastSearch);
  }

  componentWillUnmount(): void {
    if (this.pageChangeTimeoutId) {
      clearTimeout(this.pageChangeTimeoutId);
    }
  }

  loadCharactersFromJson = async (lastSearch: string) => {
    this.setState({ isLoading: true, errorCode: null });

    try {
      const response = await fetch(CHARACTERS_JSON_PATH);

      if (!response.ok) {
        throw Object.assign(new Error('Failed to load'), { status: response.status });
      }

      const allCharacters = await response.json();

      const filteredCharacters = this.getFilteredCharacters(allCharacters, lastSearch);
      const currentPage = 1;
      const charactersForPage = this.getCharactersForPage(filteredCharacters, currentPage);
      const totalPages = this.getTotalPages(filteredCharacters);

      this.setState({
        allCharacters,
        filteredCharacters,
        charactersForPage,
        currentPage,
        totalPages,
        isLoading: false,
        isEmpty: filteredCharacters.length === 0,
      });
    } catch (err: unknown) {
      this.handleError(err);
    }
  };

  getFilteredCharacters = (characters: TCharacter[], lastSearch: string) => {
    const normalizedSearch = lastSearch.trim().toLowerCase();

    if (!normalizedSearch) {
      return characters;
    }

    return characters.filter((character) =>
      character.name.toLowerCase().includes(normalizedSearch),
    );
  };

  getTotalPages = (characters: TCharacter[]) => {
    return Math.ceil(characters.length / ITEMS_PER_PAGE);
  };

  getCharactersForPage = (characters: TCharacter[], page: number) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return characters.slice(startIndex, endIndex);
  };

  loadCharacters = async (page: number, lastSearch: string) => {
    const { allCharacters } = this.state;

    const filteredCharacters = this.getFilteredCharacters(allCharacters, lastSearch);
    const charactersForPage = this.getCharactersForPage(filteredCharacters, page);
    const totalPages = this.getTotalPages(filteredCharacters);

    this.setState({
      charactersForPage,
      filteredCharacters,
      totalPages,
      currentPage: page,
      errorCode: null,
    });
  };

  handleError = (err: unknown) => {
    this.setState({
      allCharacters: [],
      filteredCharacters: [],
      charactersForPage: [],
      totalPages: 0,
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
    const { filteredCharacters, isLoading } = this.state;
    const totalPages = this.getTotalPages(filteredCharacters);

    if (isLoading || page < 1 || page > totalPages) {
      return;
    }

    if (this.pageChangeTimeoutId) {
      clearTimeout(this.pageChangeTimeoutId);
    }

    this.setState({ isLoading: true });

    this.pageChangeTimeoutId = setTimeout(() => {
      const charactersForPage = this.getCharactersForPage(filteredCharacters, page);
      this.setState({ currentPage: page, isLoading: false, charactersForPage });

      this.pageChangeTimeoutId = null;
    }, PAGE_CHANGE_DELAY_MS);
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
    const {
      lastSearch,
      charactersForPage,
      currentPage,
      totalPages,
      isLoading,
      errorCode,
      isEmpty,
    } = this.state;

    return (
      <>
        <SearchField initialValue={lastSearch} onSearch={this.handleSearch} />

        <ResultsBlock
          characters={charactersForPage}
          currentPage={currentPage}
          totalPages={totalPages}
          isLoading={isLoading}
          errorCode={errorCode}
          isEmpty={isEmpty}
          handlePreviousPage={this.handlePreviousPage}
          handleNextPage={this.handleNextPage}
        />
      </>
    );
  }
}
