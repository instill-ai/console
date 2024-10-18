"use client";

import * as React from "react";
import { ControllerRenderProps } from "react-hook-form";

import { Form } from "@instill-ai/design-system";

import { AutoFormFieldBaseProps, Nullable } from "../../..";
import { FileInputDropArea } from "../../../../components";
import { readFileToBinary } from "../../../../view";
import { FieldDescriptionTooltip } from "../common";
import { FileListItem } from "../trigger-request-form-fields/FileListItem";
import { UploadFileInput } from "../trigger-request-form-fields/UploadFileInput";

export const ImageField = ({
  form,
  path,
  size,
  title,
  description,
  shortDescription,
  disabled,
  isHidden,
  isRequired,
}: {
  shortDescription?: string;
  disabled?: boolean;
} & AutoFormFieldBaseProps) => {
  const [imageFile, setImageFile] = React.useState<Nullable<File>>();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const value = form.getValues(path);

  const onUpdateFile = async (field: ControllerRenderProps, file?: File) => {
    if (file) {
      const binary = await readFileToBinary(file);

      field.onChange(binary);
      setImageFile(file);
    }

    return;
  };

  return isHidden ? null : (
    <Form.Field
      key={path}
      control={form.control}
      name={path}
      render={({ field }) => {
        return (
          <Form.Item className="w-full">
            <div className="flex flex-row gap-x-2">
              <Form.Label
                className={size === "sm" ? "!product-body-text-4-medium" : ""}
              >
                {isRequired ? `${title} *` : title}
              </Form.Label>
              <FieldDescriptionTooltip description={description} />
            </div>
            <div className="w-full">
              {imageFile ? (
                <img
                  key={`${path}-${imageFile.name}`}
                  src={URL.createObjectURL(imageFile)}
                  alt={`${path}-${imageFile.name}`}
                  className="h-[360px] w-full object-contain"
                />
              ) : value ? (
                <img
                  key={`${value.slice(
                    value.indexOf(",") + 1,
                    value.indexOf(",") + 13,
                  )}`}
                  src={value}
                  alt={path}
                  className="h-[360px] w-full object-contain"
                />
              ) : (
                <div
                  key={`${path}-image-placeholder`}
                  className="w-full rounded-sm border border-semantic-bg-line bg-transparent"
                >
                  <FileInputDropArea
                    disabled={disabled}
                    onDrop={async (fileList: FileList | null) => {
                      onUpdateFile(field, fileList?.[0]);
                    }}
                  >
                    , or{" "}
                    <Form.Control>
                      <UploadFileInput
                        keyPrefix={path}
                        ref={inputRef}
                        title="browse computer"
                        fieldKey={path}
                        accept="image/*"
                        onChange={async (event) => {
                          await onUpdateFile(field, event.target.files?.[0]);

                          // Reset the input value so we can use the same file again
                          // after we delete it
                          event.target.value = "";
                        }}
                        disabled={disabled}
                        className="font-normal no-underline !bg-transparent !p-0 !inline-block"
                      />
                    </Form.Control>
                  </FileInputDropArea>
                </div>
              )}
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
            ) : value ? (
              <FileListItem
                name={value.slice(
                  value.indexOf(",") + 1,
                  value.indexOf(",") + 13,
                )}
                onDelete={() => {
                  setImageFile(null);
                  field.onChange(null);
                  if (inputRef.current) {
                    inputRef.current.value = "";
                  }
                }}
              />
            ) : null}
            <Form.Description
              className="nodrag nopan cursor-text select-text !text-xs"
              text={shortDescription ?? null}
            />
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};
