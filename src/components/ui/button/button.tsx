import React from 'react';
import styles from './button.module.css';
import classNames from 'classnames/bind';

const cn = classNames.bind(styles);

type TUIButtonProps = {
  text: string;
  disabled?: boolean;
  handleClick?: () => void;
  extraClass?: string;
  type?: 'button' | 'submit';
};

export const UIButton: React.FC<TUIButtonProps> = ({
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
      type={type ? type : 'button'}
    >
      {text}
    </button>
  );
};
