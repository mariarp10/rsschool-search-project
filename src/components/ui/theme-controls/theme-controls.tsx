import { type FC } from 'react';
import style from './theme-controls.module.css';
import classNames from 'classnames/bind';
import {
  useTheme,
  useToggleTheme,
} from '@components/theme-provider/theme-context';
import { MoonIcon } from '@assets/icons/moon-icon';
import { SunIcon } from '@assets/icons/sun-icon';

const cn = classNames.bind(style);

export const ThemeControls: FC = () => {
  const theme = useTheme();
  const toggleTheme = useToggleTheme();

  return (
    <div className={cn('container')}>
      <button className={cn('button')} onClick={toggleTheme}>
        {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
      </button>
    </div>
  );
};
