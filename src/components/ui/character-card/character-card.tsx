import React from 'react';
import type { TCharacter } from '@utils/types';
import styles from './character-card.module.css';

type TCharacterCardProps = {
  character: TCharacter;
};

export class CharacterCard extends React.Component<TCharacterCardProps> {
  render(): React.ReactNode {
    return (
      <li className={styles.list_item}>
        <button className={`${styles.card_container}`}>
          <div className={`${styles.image_container}`}>
            <img
              className={`${styles.avatar}`}
              src={`${this.props.character.image}`}
              alt={'Picture of character'}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/images/placeholder-image.png';
              }}
            />
            <div className={styles.overlay}>
              <h3 className={styles.name}>{this.props.character.name}</h3>
            </div>
          </div>
        </button>
      </li>
    );
  }
}
