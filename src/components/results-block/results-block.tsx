import React from 'react';
import type { TCharacter } from '@utils/types';
import { CharacterCard } from '@ui/character-card';
import { CardsList } from '@ui/cards-list';
import { UIPagination } from '@ui/pagination';

type ResultsProps = {
  characters: TCharacter[];
  currentPage: number;
  totalPages: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
};
export class ResultsBlock extends React.Component<ResultsProps> {
  render() {
    return (
      <>
        <CardsList>
          {this.props.characters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </CardsList>
        {this.props.totalPages > 1 && (
          <UIPagination
            currentPage={this.props.currentPage}
            totalPages={this.props.totalPages}
            handleNextPage={this.props.handleNextPage}
            handlePreviousPage={this.props.handlePreviousPage}
          ></UIPagination>
        )}
      </>
    );
  }
}
