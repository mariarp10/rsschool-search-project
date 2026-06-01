export const queryKeys = {
  characters: (page: number, name?: string) => [
    'characters',
    { page, name: name ?? '' },
  ],
  characterDetails: (id: number) => ['character-details', id],
};
