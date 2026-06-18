import { type FC } from 'react';
import style from './theme-controls.module.css';
import classNames from 'classnames/bind';
import {
  useTheme,
  useToggleTheme,
} from '@components/theme-provider/theme-context';

const cn = classNames.bind(style);

export const ThemeControls: FC = () => {
  const theme = useTheme();
  const toggleTheme = useToggleTheme();

  return (
    <div className={cn('container')}>
      <button
        aria-label="Toggle theme"
        type="button"
        className={cn('button')}
        onClick={toggleTheme}
      >
        <span
          aria-hidden="true"
          className={cn('icon', {
            moon: theme === 'dark',
            sun: theme !== 'dark',
          })}
        />
      </button>
    </div>
  );
};
