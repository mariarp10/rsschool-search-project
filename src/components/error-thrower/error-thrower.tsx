import React from 'react';
import styles from './error-thrower.module.css';

type TErrorThrowerState = { shouldThrow: boolean };

export class ErrorThrower extends React.Component<Record<string, never>, TErrorThrowerState> {
  state: TErrorThrowerState = { shouldThrow: false };

  handleClick = () => {
    this.setState({ shouldThrow: true });
  };

  render(): React.ReactNode {
    if (this.state.shouldThrow) {
      throw new Error('Test error');
    }

    return (
      <div className={styles.container}>
        <button onClick={this.handleClick}>Test Error</button>
      </div>
    );
  }
}
