'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@ui/button/button';
import styles from './pagination.module.css';
import classNames from 'classnames/bind';
import { useResultsStore } from '@store/results.store';

const cn = classNames.bind(styles);

type PaginationProps = {
  totalPages: number;
  isLoading: boolean;
};

export const Pagination = ({ totalPages, isLoading }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page') ?? 1);

  const setLoading = useResultsStore((state) => state.setLoading);

  const changePage = (nextPage: number) => {
    setLoading();

    const params = new URLSearchParams(searchParams.toString());

    params.set('page', String(nextPage));

    router.push(`/characters?${params.toString()}`);

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
