import { z } from 'zod';

const characterOriginSchema = z.object({
  name: z.string(),
  url: z.string(),
});

const characterLocationSchema = z.object({
  name: z.string(),
  url: z.string(),
});

export const characterSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.string(),
  species: z.string(),
  type: z.string(),
  gender: z.string(),
  origin: characterOriginSchema,
  location: characterLocationSchema,
  image: z.string(),
  episode: z.array(z.string()),
  url: z.string(),
  created: z.string(),
});

export const characterResponseSchema = z.object({
  info: z.object({
    count: z.number(),
    pages: z.number(),
    next: z.string().nullable(),
    prev: z.string().nullable(),
  }),
  results: z.array(characterSchema),
});
