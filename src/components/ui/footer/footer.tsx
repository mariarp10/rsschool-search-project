import React from 'react';
import styles from './footer.module.css';
import classNames from 'classnames/bind';

const cn = classNames.bind(styles);

export const Footer: React.FC = () => {
  return (
    <footer className={cn('footer')}>
      <p>RSSchool 2026</p>
    </footer>
  );
};
