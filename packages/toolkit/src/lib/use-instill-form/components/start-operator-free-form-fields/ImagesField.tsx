import * as React from "react";
import cn from "clsx";
import { Form, ScrollArea } from "@instill-ai/design-system";
import { AutoFormFieldBaseProps, fillArrayWithZeros } from "../../..";
import { readFileToBinary } from "../../../../view";
import { FieldHead } from "./FieldHead";
import { FileListItem } from "./FileListItem";
import { UploadFileInput } from "./UploadFileInput";
import { StartOperatorFreeFormFieldBaseProps } from "../../types";

export const ImagesField = ({
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
  const [imageFiles, setImageFiles] = React.useState<File[]>([]);
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

            <div
              className={cn(
                "grid w-full grid-flow-row grid-cols-4",
                mode === "build"
                  ? ""
                  : "rounded-sm border border-semantic-bg-line"
              )}
            >
              {imageFiles.length > 0
                ? fillArrayWithZeros(imageFiles, 8)
                    .slice(0, 8)
                    .map((file, i) => {
                      return file ? (
                        <img
                          key={`${path}-${file.name}`}
                          src={URL.createObjectURL(file)}
                          alt={`${path}-${file.name}`}
                          className={cn(
                            mode === "build"
                              ? "h-[55px] object-cover"
                              : "h-[140px] object-contain"
                          )}
                        />
                      ) : (
                        <div
                          key={`${path}-${i}`}
                          className={cn(
                            "w-full bg-semantic-bg-secondary",
                            mode === "build"
                              ? "h-[55px] object-cover"
                              : "h-[140px] object-contain"
                          )}
                        />
                      );
                    })
                : Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={`${path}-${i}`}
                      className={cn(
                        "w-full",
                        mode === "build"
                          ? "h-[55px] bg-semantic-bg-secondary object-cover"
                          : "h-[140px] object-contain"
                      )}
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
                      const binaries: string[] = [];
                      for (const file of e.target.files) {
                        const binary = await readFileToBinary(file);
                        files.push(file);
                        binaries.push(binary);
                      }
                      field.onChange(binaries);
                      setImageFiles((prev) => [...prev, ...files]);
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
            {imageFiles.length > 0 ? (
              <ScrollArea.Root
                className={cn(
                  "nowheel h-[216px] rounded-sm p-2",
                  mode === "build"
                    ? "bg-semantic-bg-secondary"
                    : "border border-semantic-bg-line"
                )}
              >
                <div className="flex h-full flex-col gap-y-2">
                  {imageFiles.map((e, i) => (
                    <FileListItem
                      key={`${path}-${e.name}-item`}
                      name={e.name}
                      onDelete={() => {
                        const newFiles = imageFiles.filter(
                          (_, index) => index !== i
                        );

                        setImageFiles(newFiles);
                        field.onChange(
                          newFiles.map((file) => {
                            return readFileToBinary(file);
                          })
                        );

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
            <Form.Description className="!text-xs" text={description} />
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};
