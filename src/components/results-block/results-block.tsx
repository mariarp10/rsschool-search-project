import React from 'react';
import type { TCharacter } from '@utils/types';
import { CharacterCard } from '@ui/character-card';
import { CardsList } from '@ui/cards-list';
import { UIPagination } from '@ui/pagination';
import { UILoader } from '@ui/loader';

type ResultsProps = {
  characters: TCharacter[];
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
};
export class ResultsBlock extends React.Component<ResultsProps> {
  render() {
    return (
      <>
        {this.props.isLoading && <UILoader></UILoader>}
        {!this.props.isLoading && (
          <CardsList>
            {this.props.characters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </CardsList>
        )}
        {this.props.totalPages > 1 && (
          <UIPagination
            currentPage={this.props.currentPage}
            totalPages={this.props.totalPages}
            isLoading={this.props.isLoading}
            handleNextPage={this.props.handleNextPage}
            handlePreviousPage={this.props.handlePreviousPage}
          ></UIPagination>
        )}
      </>
    );
  }
}
