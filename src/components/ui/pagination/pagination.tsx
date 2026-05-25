import React from 'react';
import { UIButton } from '@ui/button';
import styles from './pagination.module.css';
import classNames from 'classnames/bind';

const cn = classNames.bind(styles);

type TUIPaginationProps = {
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
};

export const UIPagination: React.FC<TUIPaginationProps> = ({
  currentPage,
  totalPages,
  isLoading,
  handlePreviousPage,
  handleNextPage,
}) => {
  return (
    <section className={cn('container')}>
      <UIButton
        text="Previous"
        handleClick={handlePreviousPage}
        disabled={isLoading || currentPage === 1}
      />
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <UIButton
        text="Next"
        handleClick={handleNextPage}
        disabled={isLoading || currentPage === totalPages}
      />
    </section>
  );
};
