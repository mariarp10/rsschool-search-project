import React from 'react';
import styles from './header.module.css';
import classNames from 'classnames/bind';
import { Link } from '@tanstack/react-router';

const cn = classNames.bind(styles);

export const Header: React.FC = () => {
  return (
    <header className={cn('header')}>
      <Link to="/" className={cn('link')}>
        <h1 className={cn('title')}>Rick and Morty Search</h1>
      </Link>
      <Link to="/about" className={cn('link')}>
        About
      </Link>
    </header>
  );
};
