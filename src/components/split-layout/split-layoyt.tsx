'use client';

import { useSearchParams } from 'next/navigation';
import { Characters } from '@pages/characters/characters';
import { CharacterDetails } from '@components/character-details/character-details';
import classNames from 'classnames/bind';
import styles from './split-layout.module.css';

const cn = classNames.bind(styles);

export const SplitLayout = () => {
  const searchParams = useSearchParams();

  const detailsId = searchParams.get('detailsId');
  const characterId = detailsId ? Number(detailsId) : null;

  return (
    <div className={cn('split-container')}>
      <Characters />

      {characterId && (
        <aside className={cn('details-panel')}>
          <CharacterDetails id={characterId} />
        </aside>
      )}
    </div>
  );
};
