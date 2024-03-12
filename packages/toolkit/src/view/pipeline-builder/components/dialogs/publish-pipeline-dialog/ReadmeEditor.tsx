"use client";

import * as React from "react";
import * as z from "zod";
import { EditorContent, useEditor } from "@tiptap/react";
import {
  Nullable,
  deserialize,
  extensions,
  serialize,
} from "../../../../../lib";
import { UseFormReturn } from "react-hook-form";
import { PublishPipelineFormSchema } from "./PublishPipelineDialog";
import { Form } from "@instill-ai/design-system";

export const ReadmeEditor = ({
  form,
  readme,
}: {
  form: UseFormReturn<
    z.infer<typeof PublishPipelineFormSchema>,
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    any,
    undefined
  >;
  readme: Nullable<string>;
}) => {
  const timer = React.useRef<Nullable<number>>(null);
  const editor = useEditor({
    extensions: extensions,
    editorProps: {
      attributes: {
        class: "w-full h-full markdown-body rounded-[12px] p-6",
      },
    },
    content: "<h2>Your Pipeline Readme</h2>",
    onUpdate: ({ editor }) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }

      timer.current = window.setTimeout(() => {
        try {
          const md = serialize(editor.schema, editor.getJSON());
          form.setValue("readme", md);
        } catch (err) {
          console.error(err);
        }
      }, 1000);
    },
  });

  React.useEffect(() => {
    if (!readme || !editor) return;

    const parsed = deserialize(editor.schema, readme);

    editor.commands.setContent(parsed);
  }, [readme, editor]);

  return (
    <Form.Field
      control={form.control}
      name="readme"
      render={() => {
        return (
          <Form.Item className="h-full w-full flex-1 px-8">
            <Form.Control>
              <div className="h-full rounded-[12px] border border-semantic-bg-line">
                <EditorContent className="h-full" editor={editor} />
              </div>
            </Form.Control>
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};
