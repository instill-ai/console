"use client";
import * as React from "react";
import cn from "clsx";
const {
  MDXEditor,
  codeBlockPlugin,
  headingsPlugin,
  listsPlugin,
  linkPlugin,
  quotePlugin,
  markdownShortcutPlugin,
} = await import("@mdxeditor/editor");
import "@mdxeditor/editor/style.css";

import type { MDXEditorMethods } from "@mdxeditor/editor";

export type EditorProps = {
  defaultValue: string;
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
  className?: string;
  onChange?: (markdown: string) => void;
};

export const MDEditor: React.FC<EditorProps> = ({
  onChange,
  defaultValue,
  editorRef,
  className,
}) => {
  const [value, setValue] = React.useState(defaultValue);

  return (
    <MDXEditor
      ref={editorRef}
      markdown={defaultValue}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        markdownShortcutPlugin(),
        linkPlugin(),
        codeBlockPlugin(),
      ]}
      onChange={(markdown) => {
        setValue(markdown);
      }}
      onBlur={() => {
        if (onChange) onChange(value);
      }}
      placeholder="Add pipeline description here..."
      contentEditableClassName="markdown-body"
      className={cn("w-full h-full", className)}
    />
  );
};
