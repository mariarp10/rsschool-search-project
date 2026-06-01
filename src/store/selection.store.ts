import { create } from 'zustand';
import type { TCharacter } from '@utils/types';

type TSelectionState = {
  selectedCharacters: TCharacter[];
  toggleSelection: (character: TCharacter) => void;
  clearSelection: () => void;
};

export const useSelectionStore = create<TSelectionState>()((set, get) => ({
  selectedCharacters: [],

  toggleSelection: (character: TCharacter): void => {
    const isSelected = get().selectedCharacters.some(
      (item) => item.id === character.id,
    );

    if (isSelected) {
      set((state) => ({
        selectedCharacters: state.selectedCharacters.filter(
          (item) => item.id !== character.id,
        ),
      }));

      return;
    }

    set((state) => ({
      selectedCharacters: [...state.selectedCharacters, character],
    }));
  },

  clearSelection: (): void => {
    set({
      selectedCharacters: [],
    });
  },
}));
