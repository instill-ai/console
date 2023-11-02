import { StateCreator } from "zustand";
import { InstillStore, InstillStoreMutators, SmartHintSlice } from "./types";

export const createSmartHintSlice: StateCreator<
  InstillStore,
  InstillStoreMutators,
  [],
  SmartHintSlice
> = (set) => ({
  smartHints: [],
  updateSmartHints: (smartHints) => set({ smartHints }),
});
