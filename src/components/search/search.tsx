'use client';

import { type ChangeEvent, type SubmitEvent, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@ui/button/button';
import { Input } from '@ui/input/input';
import styles from './search.module.css';
import classNames from 'classnames/bind';
import { useLocalStorage } from '@hooks/local-storage/use-local-storage';
import { useFetchCharacters } from '@hooks/use-fetch-characters';

const cn = classNames.bind(styles);

export const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page') ?? 1);
  const name = searchParams.get('name') ?? '';

  const [lastSearch, setLastSearch] = useLocalStorage('lastSearch');
  const [userInput, setUserInput] = useState<string>(lastSearch);

  const shouldRestoreLastSearch = !name && Boolean(lastSearch);

  useEffect(() => {
    if (!shouldRestoreLastSearch) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    params.set('page', '1');
    params.set('name', lastSearch);

    router.replace(`/characters?${params.toString()}`);
  }, [lastSearch, router, searchParams, shouldRestoreLastSearch]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  useFetchCharacters(page, !shouldRestoreLastSearch, name);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedSearch = userInput.trim().toLowerCase();

    if (trimmedSearch === lastSearch) {
      return;
    }

    setLastSearch(trimmedSearch);

    const params = new URLSearchParams(searchParams.toString());

    params.set('page', '1');

    if (trimmedSearch) {
      params.set('name', trimmedSearch);
    } else {
      params.delete('name');
    }

    router.push(`/characters?${params.toString()}`);
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
