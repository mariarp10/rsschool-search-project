import React, { useEffect, useState } from 'react';
import { type TCharacter } from '@utils/types';
import { useNavigate } from '@tanstack/react-router';
import { Route as CharactersRoute } from '@routes/characters';
import { getDetails } from '@utils/api';
import { getStatusCode } from '@utils/helpers';
import classNames from 'classnames/bind';
import styles from './character-details.module.css';
import { UIErrorNotification } from '@ui/error-notification';

const DETAILS_CHANGE_DELAY_MS = 1000;

const cn = classNames.bind(styles);

type TCharacterDetailsProps = {
  id: number;
};

type TCharacterDetailsState = {
  isLoading: boolean;
  errorCode: number | null;
  character: TCharacter | null;
};

const initialState: TCharacterDetailsState = {
  isLoading: false,
  errorCode: null,
  character: null,
};

export const CharacterDetails: React.FC<TCharacterDetailsProps> = ({ id }) => {
  const [state, setState] = useState<TCharacterDetailsState>(initialState);

  const navigate = useNavigate();
  const search = CharactersRoute.useSearch();

  useEffect(() => {
    let isCancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const loadDetails = async () => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        errorCode: null,
        character: null,
      }));

      try {
        const character = await getDetails(id);

        if (isCancelled) {
          return;
        }

        timeoutId = setTimeout(() => {
          if (isCancelled) {
            return;
          }

          setState({
            isLoading: false,
            errorCode: null,
            character,
          });
        }, DETAILS_CHANGE_DELAY_MS);
      } catch (err: unknown) {
        if (isCancelled) {
          return;
        }

        timeoutId = setTimeout(() => {
          if (isCancelled) {
            return;
          }

          setState({
            isLoading: false,
            character: null,
            errorCode: getStatusCode(err),
          });
        }, DETAILS_CHANGE_DELAY_MS);
      }
    };

    loadDetails();

    return () => {
      isCancelled = true;

      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [id]);

  const handleClose = () => {
    navigate({
      to: '/characters',
      search: {
        page: search.page,
        ...(search.name ? { name: search.name } : {}),
      },
    });
  };

  if (state.isLoading) {
    return <p>Loading...</p>;
  }

  if (state.errorCode) {
    return <UIErrorNotification errorCode={state.errorCode} />;
  }

  if (!state.character) {
    return null;
  }

  const { name, status, species, image, episode, origin } = state.character;

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
        <h3 className={cn('facts-titile')}>{name}</h3>
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
