"use client";

import type { MDXEditorMethods, MDXEditorProps } from "@mdxeditor/editor";
import type { ForwardedRef } from "react";
import {
  codeBlockPlugin,
  diffSourcePlugin,
  headingsPlugin,
  imagePlugin,
  linkPlugin,
  listsPlugin,
  MDXEditor,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
} from "@mdxeditor/editor";

export default function InitializedMDXEditor({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  return (
    <MDXEditor
      plugins={[
        codeBlockPlugin(),
        diffSourcePlugin({ viewMode: "source" }),
        headingsPlugin(),
        imagePlugin(),
        linkPlugin(),
        listsPlugin(),
        quotePlugin(),
        tablePlugin(),
        thematicBreakPlugin(),
      ]}
      {...props}
      ref={editorRef}
    />
  );
}
