import { type FC } from 'react';
import styles from './header.module.css';
import classNames from 'classnames/bind';
import { Link } from '@tanstack/react-router';

const cn = classNames.bind(styles);

export const Header: FC = () => {
  return (
    <header className={cn('header')}>
      <h1 className={cn('title')}>Rick and Morty Search</h1>
      <nav className={cn('menu')}>
        <Link to="/" className={cn('link')}>
          Home
        </Link>
        <Link to="/about" className={cn('link')}>
          About
        </Link>
      </nav>
    </header>
  );
};
