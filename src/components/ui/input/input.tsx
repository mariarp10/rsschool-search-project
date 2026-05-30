import { type FC, type ChangeEvent, type KeyboardEvent } from 'react';
import styles from './input.module.css';
import classNames from 'classnames/bind';

const cn = classNames.bind(styles);

type InputProps = {
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
};

export const Input: FC<InputProps> = ({
  placeholder,
  value,
  onChange,
  onKeyDown,
}) => {
  return (
    <input
      type="search"
      className={cn('input')}
      placeholder={placeholder}
      onChange={onChange}
      onKeyDown={onKeyDown}
      value={value}
    />
  );
};
