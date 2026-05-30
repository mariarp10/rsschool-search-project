import type { Character } from '../src/utils/types';

export const MockCharacters: Character[] = [
  {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: {
      name: 'Earth (C-137)',
      url: 'https://link-to-api.com/location/1',
    },
    location: {
      name: 'Citadel of Ricks',
      url: 'https://link-to-api.com/location/3',
    },
    image: 'https://link-to-api.com/character/avatar/1.jpeg',
    episode: [
      'https://link-to-api.com/episode/1',
      'https://link-to-api.com/episode/2',
      'https://link-to-api.com/episode/3',
    ],
    url: 'https://link-to-api.com/character/1',
    created: '2017-11-04T18:48:46.250Z',
  },
  {
    id: 2,
    name: 'Morty Smith',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: {
      name: 'unknown',
      url: '',
    },
    location: {
      name: 'Citadel of Ricks',
      url: 'https://link-to-api.com/location/3',
    },
    image: 'https://link-to-api.com/character/avatar/2.jpeg',
    episode: ['https://link-to-api.com/episode/1'],
    url: 'https://link-to-api.com/character/2',
    created: '2017-11-04T18:50:21.651Z',
  },
  {
    id: 3,
    name: 'Summer Smith',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Female',
    origin: {
      name: 'Earth (Replacement Dimension)',
      url: 'https://link-to-api.com/location/20',
    },
    location: {
      name: 'Earth (Replacement Dimension)',
      url: 'https://link-to-api.com/location/20',
    },
    image: 'https://link-to-api.com/character/avatar/3.jpeg',
    episode: [
      'https://link-to-api.com/episode/6',
      'https://link-to-api.com/episode/7',
      'https://link-to-api.com/episode/8',
    ],
    url: 'https://link-to-api.com/character/3',
    created: '2017-11-04T19:09:56.428Z',
  },
];

export const ManyCharacters = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  name: `Character ${i + 1}`,
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Female',
  origin: {
    name: 'Earth (Replacement Dimension)',
    url: 'https://link-to-api.com/location/20',
  },
  location: {
    name: 'Earth (Replacement Dimension)',
    url: 'https://link-to-api.com/location/20',
  },
  image: 'https://link-to-api.com/character/avatar/3.jpeg',
  episode: [
    'https://link-to-api.com/episode/6',
    'https://link-to-api.com/episode/7',
    'https://link-to-api.com/episode/8',
  ],
  url: 'https://link-to-api.com/character/3',
  created: '2017-11-04T19:09:56.428Z',
}));
