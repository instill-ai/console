"use client";

import * as React from "react";

import { Form } from "@instill-ai/design-system";

import { AutoFormFieldBaseProps, Nullable } from "../../..";
import { readFileToBinary } from "../../../../view";
import { StartOperatorFreeFormFieldBaseProps } from "../../types";
import { FieldHead } from "./FieldHead";
import { FileListItem } from "./FileListItem";
import { UploadFileInput } from "./UploadFileInput";

export const FileField = ({
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
  accept,
}: StartOperatorFreeFormFieldBaseProps &
  AutoFormFieldBaseProps & { accept: string }) => {
  const [uploadedFile, setUploadedFiles] = React.useState<Nullable<File>>();
  const inputRef = React.useRef<HTMLInputElement>(null);

  return isHidden ? null : (
    <Form.Field
      key={keyPrefix ? `${keyPrefix}-${path}` : path}
      control={form.control}
      name={path}
      render={({ field }) => {
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
            <div className="flex">
              <Form.Control>
                <UploadFileInput
                  keyPrefix={keyPrefix}
                  ref={inputRef}
                  title="Upload file"
                  fieldKey={path}
                  accept={accept}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const binary = await readFileToBinary(file);
                      field.onChange(binary);
                      setUploadedFiles(file);
                    }
                  }}
                  disabled={disabled}
                />
              </Form.Control>
            </div>
            {uploadedFile ? (
              <FileListItem
                name={uploadedFile.name}
                onDelete={() => {
                  setUploadedFiles(null);
                  field.onChange(null);
                  if (inputRef.current) {
                    inputRef.current.value = "";
                  }
                }}
              />
            ) : null}
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
