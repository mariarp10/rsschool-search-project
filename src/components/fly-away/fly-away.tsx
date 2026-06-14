import { useSelectionStore } from '@store/selection.store';
import classNames from 'classnames/bind';
import styles from './fly-away.module.css';
import { Button } from '@ui/button/button';
import { convertToCSV, downloadFile } from '@utils/helpers';
import { DeleteIcon } from '@assets/icons/delete-icon';

const cn = classNames.bind(styles);

export const FlyAway = () => {
  const selectedCharacters = useSelectionStore(
    (state) => state.selectedCharacters,
  );
  const clearSelection = useSelectionStore((state) => state.clearSelection);
  const toggleSelection = useSelectionStore((state) => state.toggleSelection);

  const itemsCount = selectedCharacters.length;

  const handleDownload = () => {
    const csvData = convertToCSV(selectedCharacters);
    downloadFile(csvData, `${String(itemsCount)}_characters.csv`);
  };

  if (selectedCharacters.length > 0) {
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
                  <DeleteIcon />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className={cn('controls')}>
          <Button
            text={`Download (${String(itemsCount)})`}
            handleClick={handleDownload}
          />
          <Button text={'Clear'} handleClick={clearSelection} />
        </div>
      </div>
    );
  }
};
