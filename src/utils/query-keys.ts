export const queryKeys = {
  characters: (page: number, name?: string) =>
    ['characters', { page, name: name ?? '' }] as const,
  characterDetails: (id: number) => ['character-details', id] as const,
};
