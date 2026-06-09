import { type FC, type ChangeEvent, type KeyboardEvent } from 'react';
import { Button } from '@ui/button/button';
import { Input } from '@ui/input/input';
import styles from './search.module.css';
import classNames from 'classnames/bind';

const cn = classNames.bind(styles);

type SearchProps = {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
};

export const Search: FC<SearchProps> = ({ value, onChange, onSearch }) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleClick = () => {
    onSearch(value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(value);
    }
  };

  return (
    <section className={cn('container')}>
      <div className={cn('search')}>
        <Input
          placeholder="Look up Rick and Morty characters"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <Button handleClick={handleClick} text="search" />
      </div>
      <p className={cn('hint')}>
        Try typing in names of the characters from the show: Summer, Beth, Rick
      </p>
    </section>
  );
};
