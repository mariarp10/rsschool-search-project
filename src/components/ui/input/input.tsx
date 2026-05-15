import React from 'react';
import styles from './input.module.css';
import classNames from 'classnames/bind';

const cn = classNames.bind(styles);

type TUIInputProps = {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export const UIInput: React.FC<TUIInputProps> = ({ placeholder, value, onChange, onKeyDown }) => {
  return (
    <input
      type="text"
      className={cn('input')}
      placeholder={placeholder}
      onChange={onChange}
      onKeyDown={onKeyDown}
      value={value}
      id="search"
    />
  );
};
