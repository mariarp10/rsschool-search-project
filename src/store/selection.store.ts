import { create } from 'zustand';
import type { Character } from '@utils/types';

type SelectionState = {
  selectedCharacters: Character[];
  toggleSelection: (character: Character) => void;
  clearSelection: () => void;
};

export const useSelectionStore = create<SelectionState>()((set, get) => ({
  selectedCharacters: [],

  toggleSelection: (character: Character): void => {
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
