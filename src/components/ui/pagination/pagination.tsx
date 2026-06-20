import { Button } from '@ui/button/button';
import styles from './pagination.module.css';
import classNames from 'classnames/bind';
import { useNavigate } from '@tanstack/react-router';
import { useResultsStore } from '@store/results.store';
import { Route } from '@routes/characters';

const cn = classNames.bind(styles);

type PaginationProps = {
  totalPages: number;
  isLoading: boolean;
};

export const Pagination = ({ totalPages, isLoading }: PaginationProps) => {
  const { page } = Route.useSearch();
  const navigate = useNavigate({ from: '/characters' });

  const setLoading = useResultsStore((state) => state.setLoading);

  const changePage = (nextPage: number) => {
    setLoading();

    void navigate({
      search: (prev) => ({
        ...prev,
        page: nextPage,
      }),
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousPage = () => {
    changePage(page - 1);
  };

  const handleNextPage = () => {
    changePage(page + 1);
  };

  return (
    <section role="navigation" className={cn('container')}>
      <Button
        text="Previous"
        handleClick={handlePreviousPage}
        disabled={isLoading || page === 1}
      />
      <span>
        Page {page} of {totalPages}
      </span>
      <Button
        text="Next"
        handleClick={handleNextPage}
        disabled={isLoading || page === totalPages}
      />
    </section>
  );
};
