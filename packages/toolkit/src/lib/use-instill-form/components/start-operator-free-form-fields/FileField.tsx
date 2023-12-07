import * as React from "react";
import { Form } from "@instill-ai/design-system";
import { AutoFormFieldBaseProps, Nullable } from "../../..";
import { readFileToBinary } from "../../../../view";
import { FieldHead } from "./FieldHead";
import { FileListItem } from "./FileListItem";
import { UploadFileInput } from "./UploadFileInput";

export const FileField = ({
  form,
  path,
  title,
  description,
  onEditField,
  onDeleteField,
  isHidden,
  disabled,
  keyPrefix,
}: {
  onEditField: (key: string) => void;
  onDeleteField: (key: string) => void;
} & AutoFormFieldBaseProps) => {
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
              form={form}
              title={title}
              path={path}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              disabled={disabled}
            />
            <div className="flex">
              <Form.Control>
                <UploadFileInput
                  id={`op-start-${path}`}
                  ref={inputRef}
                  title="Upload file"
                  fieldKey={path}
                  accept="*/*"
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
            <Form.Description className="!text-xs" text={description} />
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};
