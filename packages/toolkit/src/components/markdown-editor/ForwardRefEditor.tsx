"use client";

import type { MDXEditorMethods, MDXEditorProps } from "@mdxeditor/editor";
import { forwardRef } from "react";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("./InitializedMDXEditor"), {
  ssr: false,
});

export const MarkdownEditor = forwardRef<MDXEditorMethods, MDXEditorProps>(
  (props, ref) => <Editor {...props} editorRef={ref} />,
);

MarkdownEditor.displayName = "MarkdownEditor";
