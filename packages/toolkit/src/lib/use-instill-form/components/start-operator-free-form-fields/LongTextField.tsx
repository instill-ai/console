import * as React from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FieldRoot } from "./FieldRoot";
import { AutoFormFieldBaseProps } from "../../type";
import { Form } from "@instill-ai/design-system";
import { FieldHead } from "./FieldHead";
import { Nullable } from "../../../type";

const extensions = [
  StarterKit.configure({
    paragraph: {
      HTMLAttributes: {
        class: "!my-0",
      },
    },
  }),
];

export const LongTextField = ({
  form,
  path,
  title,
  onEditField,
  onDeleteField,
}: {
  onEditField: (key: string) => void;
  onDeleteField: (key: string) => void;
} & AutoFormFieldBaseProps) => {
  const [editor, setEditor] = React.useState<Nullable<Editor>>(null);

  React.useEffect(() => {
    console.log("instance");
    const instance = new Editor({
      extensions: extensions,
      editorProps: {
        attributes: {
          class:
            "prose rounded-sm min-h-[60px] border border-semantic-bg-line bg-semantic-bg-primary p-2 focus-within:border-semantic-accent-default focus-within:outline focus-within:outline-1 focus-within:outline-semantic-accent-default focus-within:ring-0 disabled-within:cursor-not-allowed disabled-within:bg-semantic-bg-secondary",
        },
      },
    });

    setEditor(instance);
  }, []);

  return (
    <FieldRoot path={path}>
      <Form.Field
        key={path}
        control={form.control}
        name={path}
        render={({ field }) => {
          return (
            <Form.Item className="w-full">
              <FieldHead
                title={title}
                path={path}
                onDeleteField={onDeleteField}
                onEditField={onEditField}
              />
              <Form.Control>
                <EditorContent value={field.value ?? ""} editor={editor} />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          );
        }}
      />
    </FieldRoot>
  );
};
