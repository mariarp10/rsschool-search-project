import React from 'react';
import styles from './cards-list.module.css';
import classNames from 'classnames/bind';

const cn = classNames.bind(styles);

type TCardListProps = {
  children: React.ReactNode;
};

export const CardsList: React.FC<TCardListProps> = ({ children }) => {
  return <ul className={cn('list')}>{children}</ul>;
};
