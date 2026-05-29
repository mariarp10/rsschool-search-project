import { type FC, type ReactNode } from 'react';
import styles from './cards-list.module.css';
import classNames from 'classnames/bind';

const cn = classNames.bind(styles);

type TCardListProps = {
  children: ReactNode;
};

export const CardsList: FC<TCardListProps> = ({ children }) => {
  return <ul className={cn('list')}>{children}</ul>;
};
