import { type ChangeEvent, type SubmitEvent, useState, useEffect } from 'react';
import { Button } from '@ui/button/button';
import { Input } from '@ui/input/input';
import styles from './search.module.css';
import classNames from 'classnames/bind';
import { useLocalStorage } from '@hooks/local-storage/use-local-storage';
import { Route } from '@routes/characters';
import { useNavigate } from '@tanstack/react-router';
import { useFetchCharacters } from '@hooks/use-fetch-characters';

const cn = classNames.bind(styles);

export const Search = () => {
  const { page, name } = Route.useSearch();

  const [lastSearch, setLastSearch] = useLocalStorage('lastSearch');
  const [userInput, setUserInput] = useState<string>(lastSearch);

  const navigate = useNavigate({ from: '/characters' });

  const shouldRestoreLastSearch = !name && Boolean(lastSearch);

  useEffect(() => {
    if (!shouldRestoreLastSearch) {
      return;
    }

    void navigate({
      search: {
        page: 1,
        name: lastSearch,
      },
      replace: true,
    });
  }, [lastSearch, navigate, shouldRestoreLastSearch]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  useFetchCharacters(page, !shouldRestoreLastSearch, name ?? '');

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedSearch = userInput.trim().toLowerCase();

    if (trimmedSearch === lastSearch) {
      return;
    }

    setLastSearch(trimmedSearch);

    void navigate({
      search: {
        page: 1,
        name: trimmedSearch || undefined,
      },
    });
  };

  return (
    <section className={cn('container')}>
      <form className={cn('search')} onSubmit={handleSubmit}>
        <Input
          placeholder="Look up Rick and Morty characters"
          value={userInput}
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
