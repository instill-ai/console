"use client";
import * as React from "react";

import { ReactCodeMirrorRef } from "@uiw/react-codemirror";

type EditorContextValue = {
  editorRef: React.RefObject<ReactCodeMirrorRef>;
};

const EditorContext = React.createContext<EditorContextValue | undefined>(
  undefined
);

export const useEditor = () => {
  const context = React.useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditor must be used within a EditorProvider");
  }
  return context;
};

export const EditorProvider = ({ children }: { children: React.ReactNode }) => {
  const editorRef = React.useRef<ReactCodeMirrorRef>(null);

  console.log(editorRef.current);

  return (
    <EditorContext.Provider value={{ editorRef }}>
      {children}
    </EditorContext.Provider>
  );
};
