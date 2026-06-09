import { type FC } from 'react';
import { Button } from '@ui/button/button';
import styles from './pagination.module.css';
import classNames from 'classnames/bind';

const cn = classNames.bind(styles);

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
};

export const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  isLoading,
  handlePreviousPage,
  handleNextPage,
}) => {
  return (
    <section role="navigation" className={cn('container')}>
      <Button
        text="Previous"
        handleClick={handlePreviousPage}
        disabled={isLoading || currentPage === 1}
      />
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <Button
        text="Next"
        handleClick={handleNextPage}
        disabled={isLoading || currentPage === totalPages}
      />
    </section>
  );
};
