import * as React from "react";
import { Form, Input } from "@instill-ai/design-system";
import { AutoFormFieldBaseProps, Nullable } from "../../..";
import { readFileToBinary } from "../../../../view";
import { FieldHead } from "./FieldHead";
import { FileListItem } from "./FileListItem";
import { UploadFileInput } from "./UploadFileInput";

export const ImageField = ({
  form,
  path,
  title,
  description,
  onEditField,
  onDeleteField,
  isHidden,
}: {
  onEditField: (key: string) => void;
  onDeleteField: (key: string) => void;
} & AutoFormFieldBaseProps) => {
  const [imageFile, setImageFile] = React.useState<Nullable<File>>();
  const inputRef = React.useRef<HTMLInputElement>(null);

  return isHidden ? null : (
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

            <div className="w-full">
              {imageFile ? (
                <img
                  key={`${path}-${imageFile.name}`}
                  src={URL.createObjectURL(imageFile)}
                  alt={`${path}-${imageFile.name}`}
                  className="h-[150px] w-full object-cover"
                />
              ) : (
                <div
                  key={`${path}-image-placeholder`}
                  className="h-[150px] w-full bg-semantic-bg-secondary"
                />
              )}
            </div>
            <div className="flex">
              <Form.Control>
                <UploadFileInput
                  id={`op-start-${path}`}
                  ref={inputRef}
                  title="Upload image"
                  fieldKey={path}
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const binary = await readFileToBinary(file);
                      field.onChange(binary);
                      setImageFile(file);
                    }
                  }}
                />
              </Form.Control>
            </div>
            {imageFile ? (
              <FileListItem
                name={imageFile.name}
                onDelete={() => {
                  setImageFile(null);
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
