import type { Character } from '@utils/types';
import { CharacterCard } from '@ui/character-card/character-card';
import { Loader } from '@ui/loader/loader';
import styles from './results.module.css';
import classNames from 'classnames/bind';
import { Button } from '@ui/button/button';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@utils/query-keys';
import { Route } from '@routes/characters.index';

const cn = classNames.bind(styles);

type ResultsProps = {
  characters: Character[];
  isLoading: boolean;
};

export const Results = ({ characters, isLoading }: ResultsProps) => {
  const { page, name } = Route.useSearch();
  const queryClient = useQueryClient();

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({
      queryKey: queryKeys.characters(page, name),
    });
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <section className={cn('container')}>
          <div className={cn('list-header')}>
            <h2 className={cn('title')}>Seen in the show</h2>
            <Button
              handleClick={() => {
                void handleRefresh();
              }}
              text="Refresh"
            />
          </div>
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
