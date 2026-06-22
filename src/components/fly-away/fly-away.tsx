'use client';

import { useSelectionStore } from '@store/selection.store';
import classNames from 'classnames/bind';
import styles from './fly-away.module.css';
import { Button } from '@ui/button/button';
import { downloadFile } from '@utils/download-csv';

const cn = classNames.bind(styles);

export const FlyAway = () => {
  const selectedCharacters = useSelectionStore(
    (state) => state.selectedCharacters,
  );
  const clearSelection = useSelectionStore((state) => state.clearSelection);
  const toggleSelection = useSelectionStore((state) => state.toggleSelection);

  const itemsCount = selectedCharacters.length;

  const handleDownload = async () => {
    const response = await fetch('/api/export-csv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedCharacters),
    });

    if (!response.ok) {
      throw new Error('Failed to generate CSV');
    }

    const csvData = await response.text();

    downloadFile(csvData, `${String(itemsCount)}_characters.csv`);
  };

  if (itemsCount === 0) {
    return null;
  }

  if (itemsCount > 0) {
    return (
      <div className={cn('container')}>
        <ul className={cn('list')}>
          {selectedCharacters.map((character) => (
            <li key={character.id}>
              <div className={cn('item')}>
                <p>{character.name}</p>
                <button
                  aria-label={`Unselect character ${character.name}`}
                  type="button"
                  className={cn('delete-button')}
                  onClick={() => toggleSelection(character)}
                >
                  <span aria-hidden="true" className={cn('icon')} />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className={cn('controls')}>
          <Button
            text={`Download (${String(itemsCount)})`}
            handleClick={() => {
              void handleDownload();
            }}
          />
          <Button text={'Clear'} handleClick={clearSelection} />
        </div>
      </div>
    );
  }
};
