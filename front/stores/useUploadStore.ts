import { create } from 'zustand';

interface UploadState {
  file?: File | undefined;
  setFile: (file?: File | undefined) => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  file: undefined,
  setFile: (file) => set({ file }),
}));
