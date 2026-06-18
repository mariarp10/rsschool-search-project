import { type FC, useEffect, useState, type SyntheticEvent } from 'react';
import type { Character } from '@utils/types';
import { useNavigate } from '@tanstack/react-router';
import { Route as CharactersRoute } from '@routes/characters';
import { getDetails } from '@utils/api';
import classNames from 'classnames/bind';
import styles from './character-details.module.css';
import { ErrorNotification } from '@ui/error-notification/error-notification';
import { ApiError } from '@utils/api-error';

const cn = classNames.bind(styles);

const PLACEHOLDER_IMAGE = '/images/placeholder-details-image.png';

const handleImageError = (event: SyntheticEvent<HTMLImageElement>) => {
  const image = event.currentTarget;

  if (image.src.includes(PLACEHOLDER_IMAGE)) {
    return;
  }

  image.src = PLACEHOLDER_IMAGE;
};

type CharacterDetailsProps = {
  id: number;
};

type CharacterDetailsState = {
  isLoading: boolean;
  hasError: boolean;
  errorCode: number | null;
  character: Character | null;
};

const initialState: CharacterDetailsState = {
  isLoading: false,
  hasError: false,
  errorCode: null,
  character: null,
};

export const CharacterDetails: FC<CharacterDetailsProps> = ({ id }) => {
  const [state, setState] = useState<CharacterDetailsState>(initialState);

  const navigate = useNavigate();
  const search = CharactersRoute.useSearch();

  useEffect(() => {
    let isActive = true;

    const loadDetails = async () => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        hasError: false,
        errorCode: null,
        character: null,
      }));

      try {
        const character = await getDetails(id);

        if (!isActive) {
          return;
        }

        setState({
          isLoading: false,
          hasError: false,
          errorCode: null,
          character,
        });
      } catch (error) {
        if (!isActive) {
          return;
        }

        setState({
          isLoading: false,
          character: null,
          hasError: true,
          errorCode: error instanceof ApiError ? error.status : null,
        });
      }
    };

    void loadDetails();

    return () => {
      isActive = false;
    };
  }, [id]);

  const handleClose = () => {
    void navigate({
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

  if (state.hasError) {
    return <ErrorNotification errorCode={state.errorCode} />;
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
          <span aria-hidden="true" className={cn('icon')} />
        </button>
      </div>

      <section className={cn('card')}>
        <img
          data-testid="character-image"
          className={cn('image')}
          src={image}
          alt=""
          onError={handleImageError}
        />

        <h3 className={cn('facts-title')}>{name}</h3>

        <div className={cn('facts-container')}>
          <p>{`Status: ${status}`}</p>
          <p>{`Species: ${species}`}</p>
          <p>{`Origin planet: ${origin.name}`}</p>
          <p>{`Appeared in ${String(episodesCount)} episode(s)`}</p>
        </div>
      </section>
    </>
  );
};
