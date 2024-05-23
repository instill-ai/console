"use client";

import cn from "clsx";
import * as React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { extensions, deserialize, Nullable, serialize } from "../lib";
import { useToast } from "@instill-ai/design-system";
import { LoadingSpin } from ".";
import { Editor } from "@tiptap/core";

export const RealTimeTextEditor = ({
  isEditable,
  content,
  onSave,
  isReady,
}: {
  isEditable: boolean;
  content: Nullable<string>;
  onSave: (content: string) => Promise<void> | void;
  isReady: boolean;
}) => {
  const { toast } = useToast();

  const timer = React.useRef<Nullable<number>>(null);

  const [isInitialized, setIsInitialized] = React.useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

  const onBlur = React.useCallback(
    (editor: Editor) => {
      if (!isReady) {
        return;
      }

      if (timer.current) {
        clearTimeout(timer.current);
      }

      setHasUnsavedChanges(true);

      timer.current = window.setTimeout(async () => {
        if (!isReady) {
          return;
        }

        try {
          const md = serialize(editor.schema, editor.getJSON());

          await onSave(md);

          setHasUnsavedChanges(false);
        } catch (err) {
          toast({
            size: "small",
            title: "Something is wrong. Please refresh the page and try again.",
            variant: "alert-error",
          });

          console.error(err);
        }
      }, 1000);
    },
    [isReady, toast, onSave]
  );

  const editor = useEditor({
    extensions: extensions,
    editable: isEditable,
    editorProps: {
      attributes: {
        class:
          "markdown-body h-full p-5 min-h-[424px] max-h-[800px] overflow-y-scroll rounded-sm !bg-transparent focus-within:outline focus-within:outline-2 focus-within:outline-semantic-accent-default",
      },
    },
    content: "",
    onBlur: ({ editor }) => {
      onBlur(editor);
    },
  });

  React.useEffect(() => {
    if (!editor) return;

    editor.setEditable(isEditable);
  }, [isEditable, editor]);

  React.useEffect(() => {
    if (!content || !editor || isInitialized) return;

    const parsed = deserialize(editor.schema, content);

    setIsInitialized(true);

    editor.commands.setContent(parsed);
  }, [content, editor, isInitialized]);

  return (
    <div className="flex w-full flex-1 flex-col">
      <EditorContent
        className={cn(
          "mb-2 w-full rounded-sm border",
          hasUnsavedChanges ? "rounded-sm border-semantic-bg-line" : ""
        )}
        editor={editor}
      />
      {hasUnsavedChanges ? (
        <div className="ml-auto flex gap-x-2">
          <div>
            <LoadingSpin className="!text-semantic-fg-disabled" />
          </div>
          <p className="my-auto text-semantic-fg-disabled product-body-text-4-medium">
            Saving changes...
          </p>
        </div>
      ) : null}
    </div>
  );
};
