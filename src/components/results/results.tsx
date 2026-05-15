import React from 'react';
import type { TCharacter } from '@utils/types';
import { CharacterCard } from '@ui/character-card';
import { CardsList } from '@ui/cards-list';
import { UILoader } from '@ui/loader';
import styles from './results.module.css';

type TResultsProps = {
  characters: TCharacter[];
  isLoading: boolean;
};
export class Results extends React.Component<TResultsProps> {
  render(): React.ReactNode {
    return (
      <>
        {this.props.isLoading ? (
          <UILoader></UILoader>
        ) : (
          <section className={styles.container}>
            <h2 className={styles.title}>Seen in the show</h2>
            <CardsList>
              {this.props.characters.map((character) => (
                <CharacterCard key={character.id} character={character} />
              ))}
            </CardsList>
          </section>
        )}
      </>
    );
  }
}
