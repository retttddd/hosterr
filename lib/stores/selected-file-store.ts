"use client";

import { create } from "zustand";

export type SelectedFile = {
  id: string;
  name: string;
  path: string;
  size: number;
  lastModified: Date | string;
  extension: string;
  type?: string;
};

type SelectedFileState = {
  selectedFile: SelectedFile | null;
  setSelectedFile: (file: SelectedFile) => void;
  clearSelectedFile: () => void;
};

export const useSelectedFileStore = create<SelectedFileState>((set) => ({
  selectedFile: null,
  setSelectedFile: (file) => set({ selectedFile: file }),
  clearSelectedFile: () => set({ selectedFile: null }),
}));

