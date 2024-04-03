import { StateCreator } from "zustand";
import { InstillStore, InstillStoreMutators, RecentlyUsedSlice } from "./types";

export const createRecentlyUsedSlice: StateCreator<
  InstillStore,
  InstillStoreMutators,
  [],
  RecentlyUsedSlice
> = (set) => ({
  recentlyUsedStartComponentFieldTypes: [],
  updateRecentlyUsedStartComponentFieldTypes: (
    fn: (prev: string[]) => string[]
  ) =>
    set((state) => {
      return {
        ...state,
        recentlyUsedStartComponentFieldTypes: fn(
          state.recentlyUsedStartComponentFieldTypes
        ),
      };
    }),
});
