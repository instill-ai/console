import { StateCreator } from "zustand";
import { InstillStore, InstillStoreMutators, SmartHintSlice } from "./types";
import { SmartHint } from "../use-smart-hint";

export const createSmartHintSlice: StateCreator<
  InstillStore,
  InstillStoreMutators,
  [],
  SmartHintSlice
> = (set) => ({
  smartHints: [],
  updateSmartHints: (fn: (prev: SmartHint[]) => SmartHint[]) =>
    set((state) => {
      return {
        ...state,
        smartHints: fn(state.smartHints),
      };
    }),
});
