import { useSelectionStore } from '@store/selection.store';
import classNames from 'classnames/bind';
import styles from './fly-away.module.css';
import { UIButton } from '@ui/button';
import { convertToCSV, downloadFile } from '@utils/helpers';

const cn = classNames.bind(styles);

export const FlyAway = () => {
  const selectedCharacters = useSelectionStore((state) => state.selectedCharacters);
  const clearSelection = useSelectionStore((state) => state.clearSelection);
  const toggleSelection = useSelectionStore((state) => state.toggleSelection);

  const itemsCount = selectedCharacters.length;

  const handleDownload = () => {
    const csvData = convertToCSV(selectedCharacters);
    downloadFile(csvData, `${itemsCount}_characters.csv`);
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
                  type="button"
                  aria-label={`Remove ${character.name}`}
                  className={cn('delete-button')}
                  onClick={() => toggleSelection(character)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M7 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h4a1 1 0 1 1 0 2h-1.069l-.867 12.142A2 2 0 0 1 17.069 22H6.93a2 2 0 0 1-1.995-1.858L4.07 8H3a1 1 0 0 1 0-2h4V4zm2 2h6V4H9v2zM6.074 8l.857 12H17.07l.857-12H6.074zM10 10a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1zm4 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1z"
                    />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className={cn('controls')}>
          <UIButton text={`Download (${itemsCount})`} handleClick={handleDownload} />
          <UIButton text={'Clear'} handleClick={clearSelection} />
        </div>
      </div>
    );
  }
};
