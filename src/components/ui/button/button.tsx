import { type FC } from 'react';
import styles from './button.module.css';
import classNames from 'classnames/bind';

const cn = classNames.bind(styles);

type ButtonProps = {
  text: string;
  disabled?: boolean;
  handleClick: () => void;
  extraClass?: string;
};

export const Button: FC<ButtonProps> = ({
  text,
  disabled,
  handleClick,
  extraClass,
}) => {
  return (
    <button
      className={cn('button', extraClass)}
      onClick={handleClick}
      type="button"
      disabled={disabled}
    >
      {text}
    </button>
  );
};
