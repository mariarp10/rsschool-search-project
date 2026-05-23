import { useSelectionStore } from '@store/selection.store';

export const FlyAway = () => {
  const selectedCharacters = useSelectionStore((state) => state.selectedCharacters);

  if (selectedCharacters.length > 0) {
    return <div></div>;
  }
};
