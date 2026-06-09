import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    throw redirect({
      to: '/characters',
      search: {
        page: 1,
      },
    });
  },
});
