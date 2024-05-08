"use client";

import * as React from "react";
import cn from "clsx";
import { Form, ScrollArea } from "@instill-ai/design-system";
import { AutoFormFieldBaseProps } from "../../..";
import { readFileToBinary } from "../../../../view";
import { FieldHead } from "./FieldHead";
import { UploadFileInput } from "./UploadFileInput";
import { AudioListItem } from "./AudioListItem";
import { StartOperatorFreeFormFieldBaseProps } from "../../types";
import { Icons } from "@instill-ai/design-system";

export const AudiosField = ({
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
  const [audioFiles, setAudioFiles] = React.useState<File[]>([]);
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

            <label
              htmlFor={`upload-file-input-${path}-${keyPrefix}`}
              className="cursor-pointer"
            >
              <div
                key={`${path}-image-placeholder`}
                className={cn(
                  "flex w-full flex-col items-center justify-center",
                  mode === "build"
                    ? "h-[150px] bg-semantic-bg-secondary"
                    : "h-[230px] rounded-sm bg-semantic-bg-base-bg"
                )}
              >
                <div className="hidden">
                  <Form.Control>
                    <UploadFileInput
                      ref={inputRef}
                      keyPrefix={keyPrefix}
                      title="Upload audios"
                      fieldKey={path}
                      accept="audio/*"
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
                          setAudioFiles((prev) => [...prev, ...files]);
                        }
                      }}
                      disabled={disabled}
                    />
                  </Form.Control>
                </div>
                <Icons.Upload01 className="h-8 w-8 stroke-semantic-fg-secondary" />
                <p className="mt-4 font-sans text-[12px] font-normal text-semantic-fg-primary">
                  Drag-and-drop audios, or{" "}
                  <span className="text-semantic-accent-default">
                    browse computer
                  </span>
                </p>
              </div>
            </label>

            {audioFiles.length > 0 ? (
              <React.Fragment>
                <div className="flex flex-row gap-x-1">
                  <button
                    type="button"
                    className="flex cursor-pointer rounded-full bg-semantic-error-bg px-2 py-0.5 font-sans text-xs font-medium text-semantic-error-default hover:bg-semantic-error-bg-alt"
                    onClick={() => {
                      field.onChange([]);
                      setAudioFiles([]);

                      if (inputRef.current) {
                        inputRef.current.value = "";
                      }
                    }}
                  >
                    Delete all
                  </button>
                </div>

                <ScrollArea.Root
                  className={cn(
                    "nowheel h-[216px] rounded-sm p-2",
                    mode === "build"
                      ? "bg-semantic-bg-secondary"
                      : "border border-semantic-bg-line"
                  )}
                >
                  <div className="flex h-full flex-col gap-y-2">
                    {audioFiles.map((e, i) => (
                      <AudioListItem
                        key={`${path}-${e.name}-item`}
                        name={e.name}
                        src={URL.createObjectURL(e)}
                        onDelete={async () => {
                          const newFiles = audioFiles.filter(
                            (_, index) => index !== i
                          );

                          const newBinaries: string[] = [];

                          for (const file of newFiles) {
                            const binary = await readFileToBinary(file);
                            newBinaries.push(binary);
                          }

                          field.onChange(newBinaries);
                          setAudioFiles(newFiles);

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
              </React.Fragment>
            ) : null}
            <Form.Description className="!text-xs" text={description} />
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};
