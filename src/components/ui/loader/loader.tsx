import { type FC } from 'react';
import styles from './loader.module.css';
import classNames from 'classnames/bind';

const cn = classNames.bind(styles);

export const Loader: FC = () => {
  return (
    <div role="status" aria-label="Loading" className={cn('loader')}>
      <div className={cn('loader-circle')} />
    </div>
  );
};
