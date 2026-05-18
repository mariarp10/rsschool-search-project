import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Route as CharactersRoute } from '@routes/characters';

type TCharacterDetailsProps = {
  id: number;
};

export const CharacterDetails: React.FC<TCharacterDetailsProps> = ({ id = 1 }) => {
  const navigate = useNavigate();
  const search = CharactersRoute.useSearch();

  const handleClose = () => {
    navigate({
      to: '/characters',
      search: {
        page: search.page,
        ...(search.name ? { name: search.name } : {}),
      },
    });
  };
  return (
    <div>
      <button onClick={handleClose}>Close</button>
      <p>{`Showing details for character ${id}`}</p>
    </div>
  );
};
