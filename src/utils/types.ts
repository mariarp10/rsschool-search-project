import type { z } from 'zod';
import type { CharacterSchema, CharacterResponseSchema } from './api.schemas';

export type Character = z.infer<typeof CharacterSchema>;

export type CharacterResponse = z.infer<typeof CharacterResponseSchema>;
