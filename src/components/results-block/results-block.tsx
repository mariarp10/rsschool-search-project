import React from 'react';
import type { TCharacter } from '@utils/types';
import api from '@utils/api';
import UIButton from '@ui/button/button';
import { CharacterCard } from '@ui/character-card';
import { CardsList } from '@ui/cards-list';

type TResultsProps = {
  searchTerm: string;
};

type TResultsState = {
  currentPage: number;
  totalPages: number;
  characters: TCharacter[];
  isLoading: boolean;
  errorCode: number | null;
};

export class ResultsBlock extends React.Component<TResultsProps, TResultsState> {
  state: TResultsState = {
    currentPage: 1,
    totalPages: 0,
    characters: [],
    isLoading: false,
    errorCode: null,
  };

  loadAllCharacters = async (page: number) => {
    this.setState({ isLoading: true, errorCode: null });

    try {
      const data = await api.getAllCharacters(page);

      this.setState({
        characters: data.results,
        totalPages: data.info.pages,
        isLoading: false,
      });
    } catch (err) {
      this.setState({
        isLoading: false,
        errorCode: Number(err),
      });
    }
  };

  handleNextPage = () => {
    const nextPage = this.state.currentPage + 1;

    if (nextPage > this.state.totalPages) {
      return;
    }

    this.setState({ currentPage: nextPage });
    this.loadAllCharacters(nextPage);
  };

  handlePreviousPage = () => {
    const previousPage = this.state.currentPage - 1;

    if (previousPage < 1) {
      return;
    }

    this.setState({ currentPage: previousPage });
    this.loadAllCharacters(previousPage);
  };

  componentDidMount() {
    this.loadAllCharacters(this.state.currentPage);
  }

  render() {
    return (
      <>
        {this.props.searchTerm === '' && (
          <>
            <CardsList>
              {this.state.characters.map((character) => (
                <CharacterCard key={character.id} character={character} />
              ))}
            </CardsList>
            <div>
              <UIButton text="Previous" handleClick={this.handlePreviousPage}></UIButton>
              <span>
                Page {this.state.currentPage} of {this.state.totalPages}
              </span>
              <UIButton text="Next" handleClick={this.handleNextPage}></UIButton>
            </div>
          </>
        )}
      </>
    );
  }
}
