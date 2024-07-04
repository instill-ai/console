'use client'

import type { ForwardedRef } from 'react'
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  linkPlugin,
  MDXEditor,
  diffSourcePlugin,
  imagePlugin,
  tablePlugin,
  codeBlockPlugin,
  type MDXEditorMethods,
  type MDXEditorProps,
} from '@mdxeditor/editor'

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
        thematicBreakPlugin()
      ]}
      {...props}
      ref={editorRef}
    />
  )
}