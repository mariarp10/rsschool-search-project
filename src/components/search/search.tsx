import React from 'react';
import { UIButton } from '@ui/button';
import { UIInput } from '@ui/input';
import styles from './search.module.css';
import classNames from 'classnames/bind';

const cn = classNames.bind(styles);

type TSearchProps = {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
};

export const Search: React.FC<TSearchProps> = ({ value, onChange, onSearch }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleClick = () => {
    onSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(value);
    }
  };

  return (
    <section className={cn('container')}>
      <div className={cn('search')}>
        <UIInput
          placeholder="Look up Rick and Morty characters"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <UIButton handleClick={handleClick} text="search" />
      </div>
      <p className={cn('hint')}>
        Try typing in names of the characters from the show: Summer, Beth, Rick
      </p>
    </section>
  );
};
