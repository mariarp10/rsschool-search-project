import styles from './footer.module.css';
import classNames from 'classnames/bind';

const cn = classNames.bind(styles);

export const Footer = () => {
  return (
    <footer className={cn('footer')}>
      <a
        href="https://rs.school/"
        rel="noopener noreferrer"
        target="_blank"
        className={cn('link')}
      >
        RSSchool 2026
      </a>
    </footer>
  );
};
