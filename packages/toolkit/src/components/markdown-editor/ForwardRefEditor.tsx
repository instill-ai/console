'use client'

import dynamic from 'next/dynamic'
import { forwardRef } from 'react'
import type { MDXEditorMethods, MDXEditorProps } from '@mdxeditor/editor'

const Editor = dynamic(() => import('./InitializedMDXEditor'), {
  ssr: false
})

export const MarkdownEditor = forwardRef<MDXEditorMethods, MDXEditorProps>((props, ref) => <Editor {...props} editorRef={ref} />)

MarkdownEditor.displayName = 'MarkdownEditor'