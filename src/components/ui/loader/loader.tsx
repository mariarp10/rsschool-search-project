import React from 'react';
import styles from './loader.module.css';

export class UILoader extends React.Component {
  render(): React.ReactNode {
    return (
      <div className={styles.loader}>
        <div className={styles.loader_circle}></div>
      </div>
    );
  }
}
