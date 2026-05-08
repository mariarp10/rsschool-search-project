import React from 'react';
import styles from './footer.module.css';
import { BrokenComponent } from '@components/broken-component';

export class Footer extends React.Component {
  render(): React.ReactNode {
    return (
      <footer className={styles.footer}>
        <BrokenComponent />
      </footer>
    );
  }
}
