import { type FC, useEffect, useState } from 'react';
import { type Character } from '@utils/types';
import { useNavigate } from '@tanstack/react-router';
import { Route as CharactersRoute } from '@routes/characters';
import { getDetails } from '@utils/api';
import classNames from 'classnames/bind';
import styles from './character-details.module.css';
import { ErrorNotification } from '@ui/error-notification/error-notification';
import { CrossIcon } from '@assets/icons/cross-icon';
import { ApiError } from '@utils/api-error';

const cn = classNames.bind(styles);

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

        setState({
          isLoading: false,
          hasError: false,
          errorCode: null,
          character,
        });
      } catch (err) {
        setState({
          isLoading: false,
          character: null,
          hasError: true,
          errorCode: err instanceof ApiError ? err.status : null,
        });
      }
    };

    loadDetails();
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
