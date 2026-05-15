import React from 'react';
import styles from './footer.module.css';
import { ErrorThrowerComponent } from '@components/error-thrower';

export class Footer extends React.Component {
  render(): React.ReactNode {
    return (
      <footer className={styles.footer}>
        <ErrorThrowerComponent />
      </footer>
    );
  }
}
