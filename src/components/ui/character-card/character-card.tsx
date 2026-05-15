import React from 'react';
import type { TCharacter } from '@utils/types';
import styles from './character-card.module.css';
import classNames from 'classnames/bind';

const cn = classNames.bind(styles);

type TCharacterCardProps = {
  character: TCharacter;
};

export const CharacterCard: React.FC<TCharacterCardProps> = ({ character }) => {
  return (
    <li className={cn('list-item')}>
      <button className={cn('card-container')}>
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
      </button>
    </li>
  );
};
