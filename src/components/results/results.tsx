'use client';

import { useSearchParams } from 'next/navigation';
import type { Character } from '@utils/types';
import { CharacterCard } from '@ui/character-card/character-card';
import { Loader } from '@ui/loader/loader';
import classNames from 'classnames/bind';
import { Button } from '@ui/button/button';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@utils/query-keys';
import styles from './results.module.css';

const cx = classNames.bind(styles);

type ResultsProps = {
  characters: Character[];
  isLoading: boolean;
};

export const Results = ({ characters, isLoading }: ResultsProps) => {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page') ?? 1);
  const name = searchParams.get('name') ?? undefined;

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
        <section className={cx('container')}>
          <div className={cx('list-header')}>
            <h2 className={cx('title')}>Seen in the show</h2>
            <Button
              handleClick={() => {
                void handleRefresh();
              }}
              text="Refresh"
            />
          </div>

          <ul className={cx('list')}>
            {characters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </ul>
        </section>
      )}
    </>
  );
};
