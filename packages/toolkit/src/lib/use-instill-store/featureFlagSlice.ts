import { StateCreator } from "zustand";

import { FeatureFlagSlice, InstillStore, InstillStoreMutators } from "./types";

export const createFeatureFlagSlice: StateCreator<
  InstillStore,
  InstillStoreMutators,
  [],
  FeatureFlagSlice
> = (set) => ({
  featureFlagChatEnabled: false,
  updateFeatureFlagChatEnabled: (fn: (prev: boolean) => boolean) =>
    set((state) => {
      return {
        ...state,
        featureFlagChatEnabled: fn(state.featureFlagChatEnabled),
      };
    }),
});
