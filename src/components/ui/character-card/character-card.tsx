import React from 'react';
import type { TCharacter } from '@utils/types';
import styles from './character-card.module.css';
import classNames from 'classnames/bind';
import { Link } from '@tanstack/react-router';

const cn = classNames.bind(styles);

type TCharacterCardProps = {
  character: TCharacter;
};

export const CharacterCard: React.FC<TCharacterCardProps> = ({ character }) => {
  return (
    <li className={cn('list-item')}>
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
            alt={'Picture of character'}
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
