import React from 'react';
import styles from './header.module.css';

export class Header extends React.Component {
  render(): React.ReactNode {
    return (
      <header className={styles.header}>
        <h1 className={styles.title}>Rick and Morty Search</h1>
      </header>
    );
  }
}
