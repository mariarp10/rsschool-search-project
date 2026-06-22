import { Characters } from '@pages/characters/characters';
import { CharacterDetails } from '@components/character-details/character-details';
import classNames from 'classnames/bind';
import styles from './split-layout.module.css';

const cn = classNames.bind(styles);

type SplitLayoutProps = {
  page: number;
  name?: string;
  characterId: number | null;
};

export const SplitLayout = ({ page, name, characterId }: SplitLayoutProps) => {
  const hasDetails = characterId !== null;

  return (
    <div className={cn('split-container', { 'with-details': hasDetails })}>
      <Characters page={page} name={name} />

      <aside className={cn('details-panel', { empty: !hasDetails })}>
        {hasDetails ? <CharacterDetails id={characterId} /> : null}
      </aside>
    </div>
  );
};
