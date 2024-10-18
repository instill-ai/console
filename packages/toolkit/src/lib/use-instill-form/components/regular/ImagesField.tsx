"use client";

import * as React from "react";
import { ControllerRenderProps } from "react-hook-form";

import { cn, Form, ScrollArea } from "@instill-ai/design-system";

import {
  AutoFormFieldBaseProps,
  GeneralRecord,
  stringToHash32Bit,
} from "../../..";
import { FileInputDropArea } from "../../../../components";
import { readFileToBinary } from "../../../../view";
import { FieldDescriptionTooltip } from "../common";
import { FileListItem } from "../trigger-request-form-fields/FileListItem";
import { UploadFileInput } from "../trigger-request-form-fields/UploadFileInput";

export const ImagesField = ({
  form,
  path,
  title,
  description,
  isHidden,
  disabled,
  keyPrefix,
  isRequired,
  size,
  shortDescription,
  instillModelPromptImageBase64ObjectFormat,
}: AutoFormFieldBaseProps & {
  shortDescription?: string;
  instillModelPromptImageBase64ObjectFormat?: boolean;
}) => {
  const [imageFiles, setImageFiles] = React.useState<File[]>([]);

  const values = form.getValues(path);

  const onUpdateFiles = async (
    field: ControllerRenderProps,
    fileList: FileList | null,
  ) => {
    if (!fileList || fileList.length === 0) {
      return;
    }

    const formImages = field.value || [];
    const files: File[] = [];

    if (instillModelPromptImageBase64ObjectFormat) {
      const binaries: GeneralRecord[] = [];

      for (const file of fileList) {
        const binary = await readFileToBinary(file);

        files.push(file);
        binaries.push({
          prompt_image_base64: binary,
        });
      }

      field.onChange(formImages.concat(binaries));
    } else {
      const binaries: string[] = [];

      for (const file of fileList) {
        const binary = await readFileToBinary(file);

        files.push(file);
        binaries.push(binary);
      }

      field.onChange(formImages.concat(binaries));
    }

    setImageFiles((prev) => [...prev, ...files]);

    return;
  };

  const onDeleteImage = async (field: ControllerRenderProps, i: number) => {
    const newFiles = imageFiles.filter((_, index) => index !== i);

    if (instillModelPromptImageBase64ObjectFormat) {
      const binaries: GeneralRecord[] = [];

      for (const file of newFiles) {
        const binary = await readFileToBinary(file);
        binaries.push({
          prompt_image_base64: binary,
        });
      }

      field.onChange(binaries);
    } else {
      const binaries: string[] = [];

      for (const file of newFiles) {
        const binary = await readFileToBinary(file);
        binaries.push(binary);
      }

      field.onChange(binaries);
    }

    setImageFiles(newFiles);
  };

  return isHidden ? null : (
    <Form.Field
      key={keyPrefix ? `${keyPrefix}-${path}` : path}
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
            {/* We may need this at some point */}
            {/* <div className="grid w-full grid-flow-row grid-cols-4 overflow-hidden rounded-sm border border-semantic-bg-line">
              {instillModelPromptImageBase64ObjectFormat &&
              Array.isArray(values) ? (
                fillArrayWithZeros(values, 8)
                  .slice(0, 8)
                  .map((value, i) => {
                    if (value.prompt_image_base64) {
                      return (
                        <img
                          key={`${path}-${i}`}
                          src={value.prompt_image_base64}
                          alt={`${path}-${i}`}
                          className="h-[140px] object-contain"
                        />
                      );
                    }
                  })
              ) : imageFiles.length > 0 ? (
                fillArrayWithZeros(imageFiles, 8)
                  .slice(0, 8)
                  .map((file, i) => {
                    return file ? (
                      <img
                        key={`${path}-${file.name}`}
                        src={URL.createObjectURL(file)}
                        alt={`${path}-${file.name}`}
                        className="h-[140px] object-contain"
                      />
                    ) : (
                      <div
                        key={`${path}-${i}`}
                        className="h-[140px] w-full bg-semantic-bg-secondary object-contain"
                      />
                    );
                  })
              ) : (
                <EmptyImageInputPlaceholder className="col-span-4" />
              )}
            </div> */}
            <FileInputDropArea
              disabled={disabled}
              onDrop={async (fileList: FileList | null) => {
                await onUpdateFiles(field, fileList);
              }}
            >
              , or{" "}
              <Form.Control>
                <UploadFileInput
                  keyPrefix={keyPrefix}
                  fieldKey={path}
                  title="browse computer"
                  accept="images/*"
                  multiple={true}
                  onChange={async (event) => {
                    await onUpdateFiles(field, event.target.files);

                    // Reset the input value so we can use the same file again
                    // after we delete it
                    event.target.value = "";
                  }}
                  disabled={disabled}
                  className="font-normal no-underline !bg-transparent !p-0 !inline-block"
                />
              </Form.Control>
            </FileInputDropArea>
            {instillModelPromptImageBase64ObjectFormat &&
            Array.isArray(values) &&
            values.length > 0 ? (
              <ScrollArea.Root
                className={cn(
                  "nowheel rounded-sm border border-semantic-bg-line p-2",
                  values.length > 4 ? "h-[216px]" : "",
                )}
              >
                <div className="flex h-full flex-col gap-y-2">
                  {values.map((value, i) => {
                    if (value.prompt_image_base64) {
                      // Using a hash function here to avoid key collisions.
                      // base64 strings can have big chunks of similar char
                      // sequences. So simply using them as is doesn't work.
                      const binaryKey = stringToHash32Bit(
                        value.prompt_image_base64,
                      );

                      return (
                        <FileListItem
                          key={`${binaryKey}-item`}
                          name={binaryKey}
                          index={i}
                          onDelete={(index?: number) => {
                            if (typeof index !== "undefined") {
                              onDeleteImage(field, index);
                            }
                          }}
                        />
                      );
                    }
                  })}
                </div>
              </ScrollArea.Root>
            ) : imageFiles.length > 0 ? (
              <ScrollArea.Root
                className={cn(
                  "nowheel rounded-sm border border-semantic-bg-line p-2",
                  imageFiles.length > 4 ? "h-[216px]" : "",
                )}
              >
                <div className="flex h-full flex-col gap-y-2">
                  {imageFiles.map((e, i) => (
                    <FileListItem
                      key={`${path}-${e.name}-item`}
                      name={e.name}
                      index={i}
                      onDelete={(index?: number) => {
                        if (typeof index !== "undefined") {
                          onDeleteImage(field, index);
                        }
                      }}
                    />
                  ))}
                </div>
              </ScrollArea.Root>
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
