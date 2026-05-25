import React, { useState } from 'react';
import { UIButton } from '@ui/button';
import { UIInput } from '@ui/input';
import styles from './search.module.css';
import classNames from 'classnames/bind';
import type { FormEvent } from 'react';

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSearch(userInput);
  };

  return (
    <section className={cn('container')}>
      <form className={cn('search')} onSubmit={handleSubmit}>
        <UIInput
          placeholder="Look up Rick and Morty characters"
          value={userInput}
          onChange={handleChange}
        />
        <UIButton text="search" type="submit" />
      </form>
      <p className={cn('hint')}>
        Try typing in names of the characters from the show: Summer, Beth, Rick
      </p>
    </section>
  );
};
