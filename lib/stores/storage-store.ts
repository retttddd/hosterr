"use client";

import { create } from "zustand";

export type SelectedStorage = {
  id: number;
  name: string;
  status?: string;
  created_at?: Date | string;
};

export type StorageFile = {
  name: string;
  size: number;
  lastModified: Date | string;
};

type StorageState = {
  selectedStorage: SelectedStorage | null;
  files: StorageFile[];
  setSelectedStorageData: (storage: SelectedStorage, files: StorageFile[]) => void;
  setFiles: (files: StorageFile[]) => void;
  addFiles: (files: StorageFile[]) => void;
  clearSelectedStorage: () => void;
};

export const useStorageStore = create<StorageState>((set) => ({
  selectedStorage: null,
  files: [],
  setSelectedStorageData: (storage, files) => set({ selectedStorage: storage, files }),
  setFiles: (files) => set({ files }),
  addFiles: (files) =>
    set((state) => ({
      files: [...state.files, ...files],
    })),
  clearSelectedStorage: () => set({ selectedStorage: null, files: [] }),
}));
