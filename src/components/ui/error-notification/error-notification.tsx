import React from 'react';
import styles from './error-notification.module.css';
import { ErrorMessages } from '../../../error-messages';
import { UIButton } from '@ui/button';

type UIErrorNotificationProps = {
  errorCode: number;
  handleAllCharacters: () => void;
  handleBackToResults: () => void;
};

export class UIErrorNotification extends React.Component<UIErrorNotificationProps> {
  getErrorMessage() {
    return ErrorMessages[this.props.errorCode];
  }

  render(): React.ReactNode {
    return (
      <div role="alert" className={styles.container}>
        <p className={styles.error_message}>{this.getErrorMessage()}</p>
        <div className={styles.buttons_container}>
          <UIButton
            extraClass={styles.big_button}
            text="Resume last search"
            handleClick={this.props.handleBackToResults}
          ></UIButton>
          <UIButton
            extraClass={styles.big_button}
            text="See all characters"
            handleClick={this.props.handleAllCharacters}
          ></UIButton>
        </div>
      </div>
    );
  }
}
