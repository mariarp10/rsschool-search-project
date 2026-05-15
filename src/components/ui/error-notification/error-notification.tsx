import React from 'react';
import styles from './error-notification.module.css';
import { ErrorMessages } from '@utils/constants';

type TUIErrorNotificationProps = {
  errorCode: number;
};

export class UIErrorNotification extends React.Component<TUIErrorNotificationProps> {
  getErrorMessage() {
    return ErrorMessages[this.props.errorCode];
  }

  render(): React.ReactNode {
    return (
      <div role="alert" className={styles.container}>
        <p className={styles.error_message}>{this.getErrorMessage()}</p>
      </div>
    );
  }
}
