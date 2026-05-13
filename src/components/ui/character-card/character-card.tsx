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
              alt={`Picture of ${this.props.character.name}`}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/images/placeholder-image.png';
              }}
            ></img>
            <div className={styles.overlay}>
              <span className={styles.name}>{this.props.character.name}</span>
            </div>
          </div>
        </button>
      </li>
    );
  }
}
