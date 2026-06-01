import React from 'react';
import styles from './input.module.css';
import classNames from 'classnames/bind';

const cn = classNames.bind(styles);

type TUIInputProps = {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const UIInput: React.FC<TUIInputProps> = ({
  placeholder,
  value,
  onChange,
}) => {
  return (
    <input
      type="text"
      className={cn('input')}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      id="search"
    />
  );
};
