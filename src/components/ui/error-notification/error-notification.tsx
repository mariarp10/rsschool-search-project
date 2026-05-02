import React from 'react';
import styles from './error-notification.module.css';
import { ErrorMessages } from '../../../error-messages';

type UIErrorNotificationProps = {
  statusCode: number;
};

export class UIErrorNotification extends React.Component<UIErrorNotificationProps> {
  getErrorMessage() {
    return ErrorMessages[this.props.statusCode];
  }

  render() {
    return (
      <div className={styles.container}>
        <p className={styles.error_message}>{this.getErrorMessage()}</p>
      </div>
    );
  }
}
