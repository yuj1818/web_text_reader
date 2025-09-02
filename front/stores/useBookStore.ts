import { create } from 'zustand';

interface BookState {
  currentBookId: number | null;
  currentCfi: string | null;
  setBook: (id: number, cfi?: string) => void;
  setCfi: (cfi: string) => void;
}

export const useBookStore = create<BookState>((set) => ({
  currentBookId: null,
  currentCfi: null,
  setBook: (id, cfi = undefined) => set({ currentBookId: id, currentCfi: cfi }),
  setCfi: (cfi) => set({ currentCfi: cfi }),
}));
