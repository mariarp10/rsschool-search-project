import styles from './error-notification.module.css';
import classNames from 'classnames/bind';

const ERROR_MESSAGES: Record<number, string> = {
  404: 'Looks like this character was not in the show. Try looking up someone else.',
  500: 'Something is wrong with the server.',
};

const cn = classNames.bind(styles);

type ErrorNotificationProps = {
  errorCode: number | null;
};

export const ErrorNotification = ({ errorCode }: ErrorNotificationProps) => {
  const getErrorMessage = () => {
    if (errorCode) {
      return ERROR_MESSAGES[errorCode];
    }
    return 'Please wait a bit longer when switching between pages';
  };

  return (
    <div role="alert" className={cn('container')}>
      <p data-testid="error-message" className={cn('error-message')}>
        {getErrorMessage()}
      </p>
    </div>
  );
};
