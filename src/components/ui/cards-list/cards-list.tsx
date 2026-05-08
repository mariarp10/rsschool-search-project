import React from 'react';
import styles from './cards-list.module.css';

type TCardListProps = {
  children: React.ReactNode;
};

export class CardsList extends React.Component<TCardListProps> {
  render(): React.ReactNode {
    return <ul className={`${styles.list}`}>{this.props.children}</ul>;
  }
}
