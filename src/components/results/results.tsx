import { type FC } from 'react';
import type { TCharacter } from '@utils/types';
import { CharacterCard } from '@ui/character-card';
import { CardsList } from '@ui/cards-list';
import { UILoader } from '@ui/loader';
import styles from './results.module.css';
import classNames from 'classnames/bind';

const cn = classNames.bind(styles);

type TResultsProps = {
  characters: TCharacter[];
  isLoading: boolean;
};
export const Results: FC<TResultsProps> = ({ characters, isLoading }) => {
  return (
    <>
      {isLoading ? (
        <UILoader />
      ) : (
        <section className={cn('container')}>
          <h2 className={cn('title')}>Seen in the show</h2>
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
