import { type FC } from 'react';
import type { Character } from '@utils/types';
import { CharacterCard } from '@ui/character-card/character-card';
import { Loader } from '@ui/loader/loader';
import styles from './results.module.css';
import classNames from 'classnames/bind';

const cn = classNames.bind(styles);

type ResultsProps = {
  characters: Character[];
  isLoading: boolean;
};
export const Results: FC<ResultsProps> = ({ characters, isLoading }) => {
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <section className={cn('container')}>
          <h2 className={cn('title')}>Seen in the show</h2>
          <ul className={cn('list')}>
            {characters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </ul>
        </section>
      )}
    </>
  );
};
