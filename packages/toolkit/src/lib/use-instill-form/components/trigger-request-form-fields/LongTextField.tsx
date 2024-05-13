"use client";

import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { AutoFormFieldBaseProps } from "../../types";
import { Form } from "@instill-ai/design-system";
import { FieldHead } from "./FieldHead";
import { Nullable } from "../../../type";
import { extensions, serialize } from "../../../tip-tap";
import { StartOperatorFreeFormFieldBaseProps } from "../../types";

export const LongTextField = ({
  mode,
  form,
  path,
  title,
  description,
  onEditField,
  onDeleteField,
  isHidden,
  disabled,
  keyPrefix,
  disabledFieldControl,
  disabledReferenceHint,
  instillFormat,
}: StartOperatorFreeFormFieldBaseProps & AutoFormFieldBaseProps) => {
  const timer = React.useRef<Nullable<number>>(null);

  // We make TipTap as a uncontrolled component, and we set a timer
  // to update the value in the form

  const editor = useEditor({
    extensions: extensions,
    editorProps: {
      attributes: {
        class:
          "nodrag nowheel prose max-h-[450px] rounded-sm min-h-[60px] border border-semantic-bg-line bg-semantic-bg-primary p-2 focus-within:border-semantic-accent-default focus-within:outline focus-within:outline-1 focus-within:outline-semantic-accent-default focus-within:ring-0 disabled-within:cursor-not-allowed disabled-within:bg-semantic-bg-secondary",
      },
    },
    onUpdate: ({ editor }) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }

      timer.current = window.setTimeout(() => {
        try {
          const md = serialize(editor.schema, editor.getJSON());
          form.setValue(path, md);
        } catch (err) {
          console.error(err);
        }
      }, 1000);
    },
  });

  return isHidden ? null : (
    <Form.Field
      key={keyPrefix ? `${keyPrefix}-${path}` : path}
      control={form.control}
      name={path}
      render={() => {
        return (
          <Form.Item className="w-full">
            <FieldHead
              mode={mode}
              title={title}
              path={path}
              instillFormat={instillFormat}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              disabledFieldControl={disabledFieldControl}
              disabledReferenceHint={disabledReferenceHint}
            />
            <Form.Control>
              <EditorContent disabled={disabled} editor={editor} />
            </Form.Control>
            <Form.Description
              className="nodrag nopan cursor-text select-text !text-xs"
              text={description}
            />
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};
