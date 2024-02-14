import * as React from "react";
import cn from "clsx";
import { Form } from "@instill-ai/design-system";
import { AutoFormFieldBaseProps, Nullable } from "../../..";
import { readFileToBinary } from "../../../../view";
import { FieldHead } from "./FieldHead";
import { FileListItem } from "./FileListItem";
import { UploadFileInput } from "./UploadFileInput";
import { StartOperatorFreeFormFieldBaseProps } from "../../types";

export const ImageField = ({
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
  const [imageFile, setImageFile] = React.useState<Nullable<File>>();
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

            <div className="w-full">
              {imageFile ? (
                <img
                  key={`${path}-${imageFile.name}`}
                  src={URL.createObjectURL(imageFile)}
                  alt={`${path}-${imageFile.name}`}
                  className={cn(
                    "w-full object-contain",
                    mode === "build" ? "h-[150px]" : "h-[360px]"
                  )}
                />
              ) : (
                <div
                  key={`${path}-image-placeholder`}
                  className={cn(
                    "flex w-full items-center justify-center",
                    mode === "build"
                      ? "h-[150px] bg-semantic-bg-secondary"
                      : "h-[260px] rounded-sm border border-semantic-bg-line bg-transparent"
                  )}
                ></div>
              )}
            </div>
            <div className="flex">
              <Form.Control>
                <UploadFileInput
                  keyPrefix={keyPrefix}
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
                  disabled={disabled}
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
