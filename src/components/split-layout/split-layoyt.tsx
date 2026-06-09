import { HomePage } from '@pages/home/home';
import { Outlet } from '@tanstack/react-router';
import classNames from 'classnames/bind';
import styles from './split-layout.module.css';
import { Route as CharactersRoute } from '@routes/characters';

const cn = classNames.bind(styles);

export const SplitLayout = () => {
  const { detailsId } = CharactersRoute.useSearch();

  return (
    <div className={cn('split-container')}>
      <HomePage />
      {detailsId && (
        <aside className={cn('details-panel')}>
          <Outlet />
        </aside>
      )}
    </div>
  );
};
