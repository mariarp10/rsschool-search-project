import { type FC } from 'react';
import styles from './error-notification.module.css';
import { ErrorMessages } from '@utils/constants';
import classNames from 'classnames/bind';

const cn = classNames.bind(styles);

type ErrorNotificationProps = {
  errorCode: number | null;
};

export const ErrorNotification: FC<ErrorNotificationProps> = ({
  errorCode,
}) => {
  const getErrorMessage = () => {
    if (errorCode) {
      return ErrorMessages[errorCode];
    }
    return 'Please wait a bit longer when switching between pages';
  };

  return (
    <div role="alert" className={cn('container')}>
      <p className={cn('error-message')}>{getErrorMessage()}</p>
    </div>
  );
};
