"use client";

import * as React from "react";
import cn from "clsx";
import { Form } from "@instill-ai/design-system";
import { AutoFormFieldBaseProps, Nullable } from "../../..";
import { readFileToBinary } from "../../../../view";
import { FieldHead } from "./FieldHead";
import { UploadFileInput } from "./UploadFileInput";
import { AudioListItem } from "./AudioListItem";
import { StartOperatorFreeFormFieldBaseProps } from "../../types";
import { Icons } from "@instill-ai/design-system";

export const AudioField = ({
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
  const [audioFile, setAudioFile] = React.useState<Nullable<File>>(null);
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
                      title="Upload audio"
                      fieldKey={path}
                      accept="audio/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setAudioFile(file);
                          const binary = await readFileToBinary(file);
                          field.onChange(binary);
                        }
                      }}
                      disabled={disabled}
                    />
                  </Form.Control>
                </div>
                <Icons.Upload01 className="h-8 w-8 stroke-semantic-fg-secondary" />
                <p className="mt-4 font-sans text-[12px] font-normal text-semantic-fg-primary">
                  Drag-and-drop audio, or{" "}
                  <span className="text-semantic-accent-default">
                    browse computer
                  </span>
                </p>
              </div>
            </label>
            {audioFile ? (
              <AudioListItem
                src={URL.createObjectURL(audioFile)}
                name={audioFile.name}
                onDelete={() => {
                  setAudioFile(null);
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
