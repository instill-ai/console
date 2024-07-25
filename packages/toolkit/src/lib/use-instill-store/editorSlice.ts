import { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { StateCreator } from "zustand";

import { Nullable } from "../type";
import { EditorSlice, InstillStore, InstillStoreMutators } from "./types";

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
});
