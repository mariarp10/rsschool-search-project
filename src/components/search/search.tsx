import React, { useState } from 'react';
import { UIButton } from '@ui/button';
import { UIInput } from '@ui/input';
import styles from './search.module.css';
import classNames from 'classnames/bind';

const cn = classNames.bind(styles);

type TSearchProps = {
  savedSearch: string;
  onSearch: (value: string) => void;
};

export const Search: React.FC<TSearchProps> = ({ savedSearch, onSearch }) => {
  const [userInput, setUserInput] = useState(savedSearch);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleClick = () => {
    onSearch(userInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(userInput);
    }
  };

  return (
    <section className={cn('container')}>
      <div className={cn('search')}>
        <UIInput
          placeholder="Look up Rick and Morty characters"
          value={userInput}
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
