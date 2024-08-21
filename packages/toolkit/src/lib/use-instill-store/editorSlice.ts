import { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { StateCreator } from "zustand";

import { Nullable } from "../type";
import {
  EditorMultiScreenModel,
  EditorSlice,
  InstillStore,
  InstillStoreMutators,
} from "./types";

export const createEditorSlice: StateCreator<
  InstillStore,
  InstillStoreMutators,
  [],
  EditorSlice
> = (set) => ({
  openCmdk: false,
  updateOpenCmdk: (fn: (prev: boolean) => boolean) =>
    set((state) => {
      return {
        ...state,
        openCmdk: fn(state.openCmdk),
      };
    }),
  editorRef: null,
  updateEditorRef: (
    fn: (
      prev: Nullable<editor.IStandaloneCodeEditor>,
    ) => Nullable<editor.IStandaloneCodeEditor>,
  ) =>
    set((state) => {
      return {
        ...state,
        editorRef: fn(state.editorRef),
      };
    }),
  monacoRef: null,
  updateMonacoRef: (fn: (prev: Nullable<Monaco>) => Nullable<Monaco>) =>
    set((state) => {
      return {
        ...state,
        monacoRef: fn(state.monacoRef),
      };
    }),
  cursorPosition: 0,
  editorMultiScreenModel: {
    main: {
      views: [],
      currentViewId: null,
    },
    topRight: {
      views: [],
      currentViewId: null,
    },
    bottomRight: {
      views: [],
      currentViewId: null,
    },
  },
  rawRecipeOnDom: null,
  updateRawRecipeOnDom: (fn: (prev: Nullable<string>) => Nullable<string>) =>
    set((state) => {
      return {
        ...state,
        rawRecipeOnDom: fn(state.rawRecipeOnDom),
      };
    }),
  isSavingRecipe: false,
  updateIsSavingRecipe: (fn: (prev: boolean) => boolean) =>
    set((state) => {
      return {
        ...state,
        isSavingRecipe: fn(state.isSavingRecipe),
      };
    }),
  hasUnsavedRecipe: false,
  updateHasUnsavedRecipe: (fn: (prev: boolean) => boolean) =>
    set((state) => {
      return {
        ...state,
        hasUnsavedRecipe: fn(state.hasUnsavedRecipe),
      };
    }),
  updateEditorMultiScreenModel: (
    fn: (prev: EditorMultiScreenModel) => EditorMultiScreenModel,
  ) =>
    set((state) => {
      return {
        ...state,
        editorMultiScreenModel: fn(state.editorMultiScreenModel),
      };
    }),
  selectedComponentId: null,
  updateSelectedComponentId: (
    fn: (prev: Nullable<string>) => Nullable<string>,
  ) =>
    set((state) => {
      return {
        ...state,
        selectedComponentId: fn(state.selectedComponentId),
      };
    }),
});
