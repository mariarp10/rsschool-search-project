import React from 'react';
import styles from './error-notification.module.css';
import { ErrorMessages } from '@utils/constants';
import classNames from 'classnames/bind';

const cn = classNames.bind(styles);

type TUIErrorNotificationProps = {
  errorCode: number;
};

export const UIErrorNotification: React.FC<TUIErrorNotificationProps> = ({ errorCode }) => {
  const getErrorMessage = () => {
    return ErrorMessages[errorCode];
  };

  return (
    <div role="alert" className={cn('container')}>
      <p className={cn('error-message')}>
        {getErrorMessage() ?? 'We know about the issue and are working to resolve it'}
      </p>
    </div>
  );
};
