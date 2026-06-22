import { Suspense } from 'react';
import { SplitLayout } from '@components/split-layout/split-layoyt';

export default function CharactersPage() {
  return (
    <Suspense fallback={null}>
      <SplitLayout />
    </Suspense>
  );
}
