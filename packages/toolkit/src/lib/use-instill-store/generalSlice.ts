import { Secret } from "instill-sdk";
import { StateCreator } from "zustand";

import { Nullable } from "../type";
import { GeneralSlice, InstillStore, InstillStoreMutators } from "./types";

export const createGeneralSlice: StateCreator<
  InstillStore,
  InstillStoreMutators,
  [],
  GeneralSlice
> = (set) => ({
  accessToken: null,
  updateAccessToken: (fn: (prev: Nullable<string>) => Nullable<string>) =>
    set((state) => {
      return {
        ...state,
        accessToken: fn(state.accessToken),
      };
    }),
  enabledQuery: false,
  updateEnabledQuery: (fn: (prev: boolean) => boolean) =>
    set((state) => {
      return {
        ...state,
        enabledQuery: fn(state.enabledQuery),
      };
    }),
  entitySecrets: [],
  updateEntitySecrets: (fn: (prev: Secret[]) => Secret[]) =>
    set((state) => {
      return {
        ...state,
        entitySecrets: fn(state.entitySecrets),
      };
    }),
  navigationNamespaceAnchor: null,
  updateNavigationNamespaceAnchor: (
    fn: (prev: Nullable<string>) => Nullable<string>,
  ) =>
    set((state) => {
      return {
        ...state,
        navigationNamespaceAnchor: fn(state.navigationNamespaceAnchor),
      };
    }),
});
