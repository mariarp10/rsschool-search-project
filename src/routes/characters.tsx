import { createFileRoute } from '@tanstack/react-router';
import { SplitLayout } from '@components/split-layout';
import { z } from 'zod';

const searchSchema = z.object({
  page: z.coerce.number().catch(1),
  name: z.string().optional(),
  detailsId: z.coerce.number().optional(),
});

export const Route = createFileRoute('/characters')({
  validateSearch: searchSchema,
  component: SplitLayout,
});
