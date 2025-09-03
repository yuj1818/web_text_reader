import { create } from 'zustand';

interface BookState {
  bookmarkCFI: string | null;
  setBookmarkCFI: (cfi: string | null) => void;
}

export const useBookStore = create<BookState>((set) => ({
  bookmarkCFI: null,
  setBookmarkCFI: (cfi) => set({ bookmarkCFI: cfi }),
}));
