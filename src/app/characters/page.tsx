import { Suspense } from 'react';
import { SplitLayout } from '@components/split-layout/split-layoyt';
import { FlyAway } from '@components/fly-away/fly-away';

export default function CharactersPage() {
  return (
    <Suspense fallback={null}>
      <SplitLayout />
      <FlyAway />
    </Suspense>
  );
}
