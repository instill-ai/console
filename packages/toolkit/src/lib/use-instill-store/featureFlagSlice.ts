import { StateCreator } from "zustand";

import { FeatureFlagSlice, InstillStore, InstillStoreMutators } from "./types";

export const createFeatureFlagSlice: StateCreator<
  InstillStore,
  InstillStoreMutators,
  [],
  FeatureFlagSlice
> = (set) => ({
  featureFlagWebhookEnabled: false,
  updateFeatureFlagWebhookEnabled: (fn: (prev: boolean) => boolean) =>
    set((state) => {
      return {
        ...state,
        featureFlagWebhookEnabled: fn(state.featureFlagWebhookEnabled),
      };
    }),
  featureFlagApplicationEnabled: false,
  updateFeatureFlagApplicationEnabled: (fn: (prev: boolean) => boolean) =>
    set((state) => {
      return {
        ...state,
        featureFlagApplicationEnabled: fn(state.featureFlagApplicationEnabled),
      };
    }),
});
