import React from 'react';
import type { TCharacter } from '@utils/types';
import styles from './character-card.module.css';
import classNames from 'classnames/bind';
import { Link } from '@tanstack/react-router';
import { useSelectionStore } from '@store/selection.store';

const cn = classNames.bind(styles);

type TCharacterCardProps = {
  character: TCharacter;
};

export const CharacterCard: React.FC<TCharacterCardProps> = ({ character }) => {
  const toggleSelection = useSelectionStore((state) => state.toggleSelection);

  const isChecked = useSelectionStore((state) =>
    state.selectedCharacters.some((selection) => selection.id === character.id),
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    toggleSelection(character);
  };

  return (
    <li className={cn('list-item')}>
      <input
        checked={isChecked}
        className={cn('checkbox')}
        type="checkbox"
        onChange={handleChange}
      />
      <Link
        to="/characters"
        search={(prev) => ({
          page: prev.page ?? 1,
          name: prev.name,
          detailsId: character.id,
        })}
        className={cn('card-container')}
      >
        <div className={cn('image-container')}>
          <img
            className={cn('avatar')}
            src={character.image}
            alt={''}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/images/placeholder-image.png';
            }}
          />
          <div className={cn('overlay')}>
            <h3 className={cn('name')}>{character.name}</h3>
          </div>
        </div>
      </Link>
    </li>
  );
};
