"use client";

import * as React from "react";
import { Form, ScrollArea } from "@instill-ai/design-system";
import {
  AutoFormFieldBaseProps,
  GeneralRecord,
  fillArrayWithZeros,
} from "../../..";
import { readFileToBinary } from "../../../../view";
import { UploadFileInput } from "../trigger-request-form-fields/UploadFileInput";
import { FileListItem } from "../trigger-request-form-fields/FileListItem";
import { FieldDescriptionTooltip } from "../common";

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
  const inputRef = React.useRef<HTMLInputElement>(null);

  const values = form.getValues(path);

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
            <div className="grid min-h-[142px] w-full grid-flow-row grid-cols-4 overflow-hidden rounded-sm border border-semantic-bg-line">
              {instillModelPromptImageBase64ObjectFormat &&
              Array.isArray(values)
                ? fillArrayWithZeros(values, 8)
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
                : imageFiles.length > 0
                  ? fillArrayWithZeros(imageFiles, 8)
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
                  : Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={`${path}-${i}`}
                        className="h-[140px] w-full object-contain"
                      />
                    ))}
            </div>
            <div className="flex flex-row gap-x-1">
              <Form.Control>
                <UploadFileInput
                  keyPrefix={keyPrefix}
                  fieldKey={path}
                  title="Upload images"
                  accept="images/*"
                  multiple={true}
                  onChange={async (e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      const files: File[] = [];

                      if (instillModelPromptImageBase64ObjectFormat) {
                        const binaries: GeneralRecord[] = [];
                        for (const file of e.target.files) {
                          const binary = await readFileToBinary(file);
                          files.push(file);
                          binaries.push({
                            prompt_image_base64: binary,
                          });
                        }
                        field.onChange(binaries);
                      } else {
                        const binaries: string[] = [];
                        for (const file of e.target.files) {
                          const binary = await readFileToBinary(file);
                          files.push(file);
                          binaries.push(binary);
                        }
                        field.onChange(binaries);
                      }

                      setImageFiles((prev) => [...prev, ...files]);

                      // Reset the input value so we can use the same file again
                      // after we delete it
                      e.target.value = "";
                    }
                  }}
                  disabled={disabled}
                />
              </Form.Control>
              {imageFiles.length > 0 ? (
                <button
                  type="button"
                  className="flex cursor-pointer rounded-full bg-semantic-error-bg px-2 py-0.5 font-sans text-xs font-medium text-semantic-error-default hover:bg-semantic-error-bg-alt"
                  onClick={() => {
                    field.onChange([]);
                    setImageFiles([]);
                    if (inputRef.current) {
                      inputRef.current.value = "";
                    }
                  }}
                >
                  Delete all
                </button>
              ) : null}
            </div>
            {instillModelPromptImageBase64ObjectFormat &&
            Array.isArray(values) ? (
              <ScrollArea.Root className="nowheel h-[216px] rounded-sm border border-semantic-bg-line p-2">
                <div className="flex h-full flex-col gap-y-2">
                  {values.map((value, i) => {
                    if (value.prompt_image_base64) {
                      const binaryKey = value.prompt_image_base64.slice(
                        value.prompt_image_base64.indexOf(",") + 1,
                        value.prompt_image_base64.indexOf(",") + 13
                      );

                      return (
                        <FileListItem
                          key={`${binaryKey}-item`}
                          name={binaryKey}
                          onDelete={async () => {
                            const newFiles = imageFiles.filter(
                              (_, index) => index !== i
                            );

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

                            // We directly remove the browser input value, we don't need it
                            // and it may cause some surprise when user reupload the same file
                            if (inputRef.current) {
                              inputRef.current.value = "";
                            }
                          }}
                        />
                      );
                    }
                  })}
                </div>
              </ScrollArea.Root>
            ) : imageFiles.length > 0 ? (
              <ScrollArea.Root className="nowheel h-[216px] rounded-sm border border-semantic-bg-line p-2">
                <div className="flex h-full flex-col gap-y-2">
                  {imageFiles.map((e, i) => (
                    <FileListItem
                      key={`${path}-${e.name}-item`}
                      name={e.name}
                      onDelete={async () => {
                        const newFiles = imageFiles.filter(
                          (_, index) => index !== i
                        );

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

                        // We directly remove the browser input value, we don't need it
                        // and it may cause some surprise when user reupload the same file
                        if (inputRef.current) {
                          inputRef.current.value = "";
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
