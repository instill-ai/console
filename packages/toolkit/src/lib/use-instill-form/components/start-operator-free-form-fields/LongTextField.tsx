import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { AutoFormFieldBaseProps } from "../../type";
import { Form } from "@instill-ai/design-system";
import { FieldHead } from "./FieldHead";
import { Blockquote } from "@tiptap/extension-blockquote";
import { BulletList } from "@tiptap/extension-bullet-list";
import { Heading } from "@tiptap/extension-heading";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Text } from "@tiptap/extension-text";
import { Document } from "@tiptap/extension-document";
import { ListItem } from "@tiptap/extension-list-item";
import { HardBreak } from "@tiptap/extension-hard-break";
import { customMarkdownSerializer } from "../../../prosemirror-markdown";
import { Nullable } from "../../../type";

const extensions = [
  Document,
  Heading,
  Paragraph.configure({
    HTMLAttributes: {
      class: "!my-0",
    },
  }),
  ListItem,
  OrderedList.configure({
    HTMLAttributes: {
      class: "!mb-0",
    },
  }),
  Blockquote,
  BulletList.configure({
    HTMLAttributes: {
      class: "!mb-0",
    },
  }),
  Text,
  HardBreak,
];

export const LongTextField = ({
  form,
  path,
  title,
  description,
  onEditField,
  onDeleteField,
}: {
  onEditField: (key: string) => void;
  onDeleteField: (key: string) => void;
} & AutoFormFieldBaseProps) => {
  const timer = React.useRef<Nullable<number>>(null);

  // We make TipTap as a uncontrolled component, and we set a timer
  // to update the value in the form

  const editor = useEditor({
    extensions: extensions,
    editorProps: {
      attributes: {
        class:
          "prose max-h-[450px] rounded-sm min-h-[60px] border border-semantic-bg-line bg-semantic-bg-primary p-2 focus-within:border-semantic-accent-default focus-within:outline focus-within:outline-1 focus-within:outline-semantic-accent-default focus-within:ring-0 disabled-within:cursor-not-allowed disabled-within:bg-semantic-bg-secondary",
      },
    },
    onUpdate: ({ editor }) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }

      timer.current = window.setTimeout(() => {
        try {
          const md = customMarkdownSerializer.serialize(editor.state.doc);
          form.setValue(path, md);
        } catch (err) {
          console.error(err);
        }
      }, 1000);
    },
  });

  return (
    <Form.Field
      key={path}
      control={form.control}
      name={path}
      render={() => {
        return (
          <Form.Item className="w-full">
            <FieldHead
              title={title}
              path={path}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
            />
            <Form.Control>
              <EditorContent editor={editor} />
            </Form.Control>
            <Form.Description className="!text-xs" text={description} />
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};
