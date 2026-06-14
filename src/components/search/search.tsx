import { type FC, type ChangeEvent, type SubmitEvent } from 'react';
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

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(value);
  };

  return (
    <section className={cn('container')}>
      <form className={cn('search')} onSubmit={handleSubmit}>
        <Input
          placeholder="Look up Rick and Morty characters"
          value={value}
          onChange={handleChange}
        />
        <Button text="search" type="submit" />
      </form>
      <p className={cn('hint')}>
        Try typing in names of the characters from the show: Summer, Beth, Rick
      </p>
    </section>
  );
};
