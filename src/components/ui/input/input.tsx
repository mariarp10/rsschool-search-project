import { type FC, type ChangeEvent } from 'react';
import styles from './input.module.css';
import classNames from 'classnames/bind';

const cn = classNames.bind(styles);

type InputProps = {
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const Input: FC<InputProps> = ({ placeholder, value, onChange }) => {
  return (
    <input
      type="search"
      className={cn('input')}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
    />
  );
};
