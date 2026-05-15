import React from 'react';
import styles from './footer.module.css';

export class Footer extends React.Component {
  render(): React.ReactNode {
    return (
      <footer className={styles.footer}>
        <p>RSSchool 2026</p>
      </footer>
    );
  }
}
