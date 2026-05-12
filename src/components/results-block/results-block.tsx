import React from 'react';
import type { TCharacter } from '@utils/types';
import { CharacterCard } from '@ui/character-card';
import { CardsList } from '@ui/cards-list';
import { UILoader } from '@ui/loader';
import styles from './results-block.module.css';

type ResultsProps = {
  characters: TCharacter[];
  isLoading: boolean;
};
export class ResultsBlock extends React.Component<ResultsProps> {
  render(): React.ReactNode {
    return (
      <>
        {this.props.isLoading ? (
          <UILoader></UILoader>
        ) : (
          <main className={styles.container}>
            <h2 className={styles.title}>Seen in the show</h2>
            <CardsList>
              {this.props.characters.map((character) => (
                <CharacterCard key={character.id} character={character} />
              ))}
            </CardsList>
          </main>
        )}
      </>
    );
  }
}
