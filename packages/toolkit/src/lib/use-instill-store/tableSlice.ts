import { Nullable } from "instill-sdk";
import { StateCreator } from "zustand";

import {
  CurrentCellPreviewAnchor,
  CurrentTableSort,
  InstillStore,
  InstillStoreMutators,
  TableMode,
  TableSlice,
} from "./types";

export const createTableSlice: StateCreator<
  InstillStore,
  InstillStoreMutators,
  [],
  TableSlice
> = (set) => ({
  leftSidebarOpen: false,
  updateLeftSidebarOpen: (fn: (prev: boolean) => boolean) =>
    set((state) => {
      return {
        ...state,
        leftSidebarOpen: fn(state.leftSidebarOpen),
      };
    }),
  rightSidebarOpen: false,
  updateRightSidebarOpen: (fn: (prev: boolean) => boolean) =>
    set((state) => {
      return {
        ...state,
        rightSidebarOpen: fn(state.rightSidebarOpen),
      };
    }),
  tableMode: "table",
  updateTableMode: (fn: (prev: TableMode) => TableMode) =>
    set((state) => {
      return {
        ...state,
        tableMode: fn(state.tableMode),
      };
    }),
  currentTablePreviewRowUid: null,
  updateCurrentTablePreviewRowUid: (
    fn: (prev: Nullable<string>) => Nullable<string>,
  ) =>
    set((state) => {
      return {
        ...state,
        currentTablePreviewRowUid: fn(state.currentTablePreviewRowUid),
      };
    }),
  currentTableSort: null,
  updateCurrentTableSort: (
    fn: (prev: Nullable<CurrentTableSort>) => Nullable<CurrentTableSort>,
  ) =>
    set((state) => {
      return {
        ...state,
        currentTableSort: fn(state.currentTableSort),
      };
    }),
  currentCellPreviewAnchor: null,
  updateCurrentCellPreviewAnchor: (
    fn: (
      prev: Nullable<CurrentCellPreviewAnchor>,
    ) => Nullable<CurrentCellPreviewAnchor>,
  ) =>
    set((state) => {
      return {
        ...state,
        currentCellPreviewAnchor: fn(state.currentCellPreviewAnchor),
      };
    }),
  forceOpenNewlyCreatedColumnContextMenuColumnUid: null,
  updateForceOpenNewlyCreatedColumnContextMenuColumnUid: (
    fn: (prev: Nullable<string>) => Nullable<string>,
  ) =>
    set((state) => {
      return {
        ...state,
        forceOpenNewlyCreatedColumnContextMenuColumnUid: fn(
          state.forceOpenNewlyCreatedColumnContextMenuColumnUid,
        ),
      };
    }),
  currentSelectedTableRowsUid: [],
  updateCurrentSelectedTableRowsUid: (fn: (prev: string[]) => string[]) =>
    set((state) => {
      return {
        ...state,
        currentSelectedTableRowsUid: fn(state.currentSelectedTableRowsUid),
      };
    }),
});
