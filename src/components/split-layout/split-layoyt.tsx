import { HomePage } from '@pages/home';
import { Outlet } from '@tanstack/react-router';
import classNames from 'classnames/bind';
import styles from './split-layout.module.css';
import { Route as CharactersRoute } from '@routes/characters';
import { FlyAway } from '@components/fly-away';

const cn = classNames.bind(styles);

export const SplitLayout = () => {
  const { detailsId } = CharactersRoute.useSearch();

  return (
    <div className={cn('split-container')}>
      <HomePage />
      <FlyAway />
      {detailsId && (
        <aside className={cn('details-panel')}>
          <Outlet />
        </aside>
      )}
    </div>
  );
};
