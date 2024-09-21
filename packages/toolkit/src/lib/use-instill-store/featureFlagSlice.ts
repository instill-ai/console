import { StateCreator } from "zustand";

import { FeatureFlagSlice, InstillStore, InstillStoreMutators } from "./types";

export const createFeatureFlagSlice: StateCreator<
  InstillStore,
  InstillStoreMutators,
  [],
  FeatureFlagSlice
> = (set) => ({
  showWebhook: false,
  updateShowWebhook: (fn: (prev: boolean) => boolean) =>
    set((state) => {
      return {
        ...state,
        showWebhook: fn(state.showWebhook),
      };
    }),
});
