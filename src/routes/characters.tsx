import { createFileRoute } from '@tanstack/react-router';
import { SplitLayout } from '@components/split-layout';
import { z } from 'zod';

const searchSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  name: z.string().optional(),
  detailsId: z.coerce.number().int().positive().optional().catch(undefined),
});

export const Route = createFileRoute('/characters')({
  validateSearch: searchSchema,
  component: SplitLayout,
});
