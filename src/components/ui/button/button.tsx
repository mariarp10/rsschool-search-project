import { type FC } from 'react';
import styles from './button.module.css';
import classNames from 'classnames/bind';

const cn = classNames.bind(styles);

type ButtonProps = {
  text: string;
  disabled?: boolean;
  handleClick?: () => void;
  extraClass?: string;
  type?: 'submit';
};

export const Button: FC<ButtonProps> = ({
  text,
  disabled,
  handleClick,
  extraClass,
  type,
}) => {
  return (
    <button
      className={cn('button', extraClass)}
      onClick={handleClick}
      disabled={disabled}
      type={type ?? 'button'}
    >
      {text}
    </button>
  );
};
