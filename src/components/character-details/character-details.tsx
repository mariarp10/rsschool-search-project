import { useNavigate } from '@tanstack/react-router';
import { Route as CharactersRoute } from '@routes/characters';
import classNames from 'classnames/bind';
import styles from './character-details.module.css';
import { ErrorNotification } from '@ui/error-notification/error-notification';
import { ApiError } from '@utils/api-error';
import { useQueryClient } from '@tanstack/react-query';
import { useCharacterQuery } from '@hooks/query/use-character-details';
import { queryKeys } from '@utils/query-keys';

const cn = classNames.bind(styles);

type CharacterDetailsProps = {
  id: number;
};

export const CharacterDetails = ({ id }: CharacterDetailsProps) => {
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
    void navigate({
      to: '/characters',
      search: {
        page: search.page,
        ...(search.name ? { name: search.name } : {}),
      },
    });
  };

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({
      queryKey: queryKeys.characterDetails(id),
    });
  };

  if (isLoading || isFetching) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <ErrorNotification errorCode={errorCode} />;
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
          onClick={() => {
            void handleRefresh();
          }}
          type="button"
          aria-label="refresh"
          className={cn('button')}
        >
          <span aria-hidden="true" className={cn('icon', 'refresh-icon')} />
        </button>
        <button
          onClick={handleClose}
          type="button"
          aria-label="Close"
          className={cn('button')}
        >
          <span aria-hidden="true" className={cn('icon', 'cross-icon')} />
        </button>
      </div>

      <section className={cn('card')}>
        <img
          data-testid="character-image"
          className={cn('image')}
          src={image}
          alt=""
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
          <p>{`Appeared in ${String(episodesCount)} episode(s)`}</p>
        </div>
      </section>
    </>
  );
};
