import React from 'react';
import styles from './cards-list.module.css';

type TCardListProps = {
  children: React.ReactNode;
};

export class CardsList extends React.Component<TCardListProps> {
  render() {
    return <div className={`${styles.list}`}>{this.props.children}</div>;
  }
}
