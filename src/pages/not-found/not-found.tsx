import classNames from 'classnames/bind';
import styles from './not-found.module.css';
import { Link } from '@tanstack/react-router';

const cn = classNames.bind(styles);

export const NotFoundPage: React.FC = () => {
  return (
    <article className={cn('container')}>
      <h1 className={cn('title')}>Sorry we could not find that page</h1>
      <img src="/images/not-found-image.png" alt="Background picture" className={cn('image')} />
      <Link to="/" className={cn('link')}>
        Back to homepage
      </Link>
    </article>
  );
};
