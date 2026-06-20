import { useState } from 'react';
import styles from './error-thrower.module.css';
import classNames from 'classnames/bind';

const cn = classNames.bind(styles);

export const ErrorThrower = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  const handleClick = () => {
    setShouldThrow(true);
  };

  if (shouldThrow) {
    throw new Error('Test error');
  }

  return (
    <div className={cn('container')}>
      <button onClick={handleClick}>Test Error</button>
    </div>
  );
};
