import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Route as CharactersRoute } from '@routes/characters';
import classNames from 'classnames/bind';
import styles from './character-details.module.css';
import { UIErrorNotification } from '@ui/error-notification';
import { useCharacterQuery } from '@hooks/query/use-character-details';
import { ApiError } from '@utils/api-error';
import { CrossIcon } from '@assets/icons/cross-icon';
import { RefreshIcon } from '@assets/icons/refresh-icon';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@utils/query-keys';

const cn = classNames.bind(styles);

type TCharacterDetailsProps = {
  id: number;
};

export const CharacterDetails: React.FC<TCharacterDetailsProps> = ({ id }) => {
  const navigate = useNavigate();
  const search = CharactersRoute.useSearch();

  const queryClient = useQueryClient();

  const {
    data: character,
    isLoading,
    isFetching,
    isError,
    error,
  } = useCharacterQuery(id);

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

  const handleRefresh = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.characterDetails(id),
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
          onClick={handleRefresh}
          type="button"
          aria-label="refresh"
          className={cn('button')}
        >
          <RefreshIcon />
        </button>
        <button
          onClick={handleClose}
          type="button"
          aria-label="Close"
          className={cn('button')}
        >
          <CrossIcon />
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
