import { StateCreator } from "zustand";

import { FolderSlice, InstillStore, InstillStoreMutators } from "./types";

export const createFolderSlice: StateCreator<
  InstillStore,
  InstillStoreMutators,
  [],
  FolderSlice
> = (set) => ({
  folderFilesBeingUploaded: {},
  updateFolderFilesBeingUploaded: (
    fn: (prev: Record<string, File[]>) => Record<string, File[]>,
  ) =>
    set((state) => {
      return {
        ...state,
        folderFilesBeingUploaded: fn(state.folderFilesBeingUploaded),
      };
    }),
});
