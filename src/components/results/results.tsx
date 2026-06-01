import React from 'react';
import type { TCharacter } from '@utils/types';
import { CharacterCard } from '@ui/character-card';
import { CardsList } from '@ui/cards-list';
import { UILoader } from '@ui/loader';
import { UIButton } from '@ui/button';
import styles from './results.module.css';
import classNames from 'classnames/bind';

const cn = classNames.bind(styles);

type TResultsProps = {
  characters: TCharacter[];
  isLoading: boolean;
  handleRefresh: () => void;
};
export const Results: React.FC<TResultsProps> = ({
  characters,
  isLoading,
  handleRefresh,
}) => {
  return (
    <>
      {isLoading ? (
        <UILoader></UILoader>
      ) : (
        <section className={cn('container')}>
          <div className={cn('list-header')}>
            <h2 className={cn('title')}>Seen in the show</h2>
            <UIButton handleClick={handleRefresh} text="Refresh" />
          </div>
          <CardsList>
            {characters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </CardsList>
        </section>
      )}
    </>
  );
};
