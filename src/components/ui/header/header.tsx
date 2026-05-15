import React from 'react';
import styles from './header.module.css';
import classNames from 'classnames/bind';

const cn = classNames.bind(styles);

export const Header: React.FC = () => {
  return (
    <header className={cn('header')}>
      <h1 className={cn('title')}>Rick and Morty Search</h1>
    </header>
  );
};
