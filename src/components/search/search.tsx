import { type ChangeEvent, type SubmitEvent, useState, useEffect } from 'react';
import { Button } from '@ui/button/button';
import { Input } from '@ui/input/input';
import styles from './search.module.css';
import classNames from 'classnames/bind';
import { useLocalStorage } from '@hooks/use-local-storage';
import { Route } from '@routes/characters';
import { useNavigate } from '@tanstack/react-router';
import { useResultsStore } from '@store/results.store';

const cn = classNames.bind(styles);

export const Search = () => {
  const { page, name } = Route.useSearch();

  const [lastSearch, setLastSearch] = useLocalStorage('lastSearch');
  const [userInput, setUserInput] = useState<string>(lastSearch);

  const navigate = useNavigate({ from: '/characters' });

  const setLoading = useResultsStore((state) => state.setLoading);
  const fetchCharacters = useResultsStore((state) => state.fetchCharacters);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  useEffect(() => {
    if (!name && lastSearch) {
      void navigate({
        search: {
          page: 1,
          name: lastSearch,
        },
        replace: true,
      });

      return;
    }

    void fetchCharacters(page, name ?? '');
  }, [page, name, lastSearch, navigate, fetchCharacters]);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedSearch = userInput.trim().toLowerCase();

    if (trimmedSearch === lastSearch) {
      return;
    }

    setLoading();

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
