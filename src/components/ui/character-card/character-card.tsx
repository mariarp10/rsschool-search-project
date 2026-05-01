import React from 'react';
import type { TCharacter } from '@utils/types';
import styles from './character-card.module.css';

type TCharacterCardProps = {
  character: TCharacter;
};

export class CharacterCard extends React.Component<TCharacterCardProps> {
  render() {
    return (
      <>
        <button className={`${styles.card_container}`}>
          <div className={`${styles.image_container}`}>
            <img
              className={`${styles.avatar}`}
              src={`${this.props.character.image}`}
              alt={`Picture of ${this.props.character.name}`}
            ></img>
          </div>
          <h3>{this.props.character.name}</h3>
        </button>
      </>
    );
  }
}
