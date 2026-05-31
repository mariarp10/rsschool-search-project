import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Route as CharactersRoute } from '@routes/characters';
import classNames from 'classnames/bind';
import styles from './character-details.module.css';
import { UIErrorNotification } from '@ui/error-notification';
import { useCharacterQuery } from '@hooks/query/use-character-details';
import { ApiError } from '@utils/api-error';

const cn = classNames.bind(styles);

type TCharacterDetailsProps = {
  id: number;
};

export const CharacterDetails: React.FC<TCharacterDetailsProps> = ({ id }) => {
  const navigate = useNavigate();
  const search = CharactersRoute.useSearch();

  const { data: character, isLoading, isFetching, isError, error } = useCharacterQuery(id);
  const errorCode = error instanceof ApiError ? error.status : null;

  const handleClose = () => {
    navigate({
      to: '/characters',
      search: {
        page: search.page,
        ...(search.name ? { name: search.name } : {}),
      },
    });
  };

  if (isLoading || isFetching) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <UIErrorNotification errorCode={errorCode} />;
  }

  if (!character) {
    return null;
  }

  const { name, status, species, image, episode, origin } = character;

  const episodesCount = episode.length;

  return (
    <>
      <div className={cn('card-header')}>
        <h2>Details about character</h2>
        <button
          onClick={handleClose}
          type="button"
          aria-label="Close"
          className={cn('close-button')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      <section className={cn('card')}>
        <img
          className={cn('image')}
          src={image}
          alt="Picture of character"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/images/placeholder-details-image.png';
          }}
        />
        <h3 className={cn('facts-title')}>{name}</h3>
        <div className={cn('facts-container')}>
          <p>{`Status: ${status}`}</p>
          <p>{`Species: ${species}`}</p>
          <p>{`Origin planet: ${origin.name}`}</p>
          <p>{`Appeared in ${episodesCount} episode(s)`}</p>
        </div>
      </section>
    </>
  );
};
