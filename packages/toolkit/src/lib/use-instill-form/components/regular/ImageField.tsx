"use client";

import * as React from "react";
import { Form } from "@instill-ai/design-system";
import { AutoFormFieldBaseProps, Nullable } from "../../..";
import { readFileToBinary } from "../../../../view";
import { FileListItem } from "../trigger-request-form-fields/FileListItem";
import { UploadFileInput } from "../trigger-request-form-fields/UploadFileInput";
import { FieldDescriptionTooltip } from "../common";

export const ImageField = ({
  form,
  path,
  size,
  title,
  description,
  shortDescription,
  disabled,
  isHidden,
}: {
  shortDescription?: string;
  disabled?: boolean;
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
            <div className="flex flex-row gap-x-2">
              <Form.Label
                className={size === "sm" ? "!product-body-text-4-medium" : ""}
              >
                {title}
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
              ) : (
                <div
                  key={`${path}-image-placeholder`}
                  className="flex h-[260px] w-full items-center justify-center rounded-sm border border-semantic-bg-line bg-transparent"
                ></div>
              )}
            </div>
            <div className="flex">
              <Form.Control>
                <UploadFileInput
                  keyPrefix={path}
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
