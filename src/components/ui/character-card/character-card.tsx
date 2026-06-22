'use client';

import { type ChangeEvent } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { Character } from '@utils/types';
import styles from './character-card.module.css';
import classNames from 'classnames/bind';
import { useSelectionStore } from '@store/selection.store';

const cn = classNames.bind(styles);

type CharacterCardProps = {
  character: Character;
};

export const CharacterCard = ({ character }: CharacterCardProps) => {
  const searchParams = useSearchParams();

  const toggleSelection = useSelectionStore((state) => state.toggleSelection);

  const isChecked = useSelectionStore((state) =>
    state.selectedCharacters.some((selection) => selection.id === character.id),
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    toggleSelection(character);
  };

  const params = new URLSearchParams(searchParams.toString());

  params.set('page', params.get('page') ?? '1');
  params.set('detailsId', String(character.id));

  const href = `/characters?${params.toString()}`;

  return (
    <li className={cn('list-item')}>
      <input
        aria-label={`Select character ${character.name}`}
        checked={isChecked}
        className={cn('checkbox')}
        type="checkbox"
        onChange={handleChange}
      />

      <Link href={href} className={cn('card-container')}>
        <div className={cn('image-container')}>
          <img
            className={cn('avatar')}
            src={character.image}
            alt=""
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/images/placeholder-image.png';
            }}
          />
          <h3 className={cn('name')}>{character.name}</h3>
        </div>
      </Link>
    </li>
  );
};
