import classNames from 'classnames/bind';
import styles from './not-found.module.css';
import Link from 'next/link';

const cn = classNames.bind(styles);

export const NotFoundPage = () => {
  return (
    <article className={cn('container')}>
      <h1 className={cn('titile')}>Sorry we could not find that page</h1>
      <img
        data-testid="not-found-image"
        src="/images/not-found-image.png"
        alt=""
        className={cn('image')}
      />
      <Link href="/" className={cn('link')}>
        Back to homepage
      </Link>
    </article>
  );
};
