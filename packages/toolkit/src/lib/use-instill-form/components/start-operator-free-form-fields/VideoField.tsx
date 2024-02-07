import * as React from "react";
import cn from "clsx";
import { Form } from "@instill-ai/design-system";
import { AutoFormFieldBaseProps, Nullable } from "../../..";
import { readFileToBinary } from "../../../../view";
import { FieldHead } from "./FieldHead";
import { FileListItem } from "./FileListItem";
import { UploadFileInput } from "./UploadFileInput";
import { StartOperatorFreeFormFieldBaseProps } from "../../types";
import { VideoPreview } from "../common";

export const VideoField = ({
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
  const [videoFile, setVideoFile] = React.useState<Nullable<File>>();
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
              form={form}
              title={title}
              path={path}
              instillFormat={instillFormat}
              onDeleteField={onDeleteField}
              onEditField={onEditField}
              disabledFieldControl={disabledFieldControl}
              disabledReferenceHint={disabledReferenceHint}
            />

            <div className="w-full">
              {videoFile ? (
                <VideoPreview
                  src={URL.createObjectURL(videoFile)}
                  className={mode === "build" ? "h-[150px]" : "h-[360px]"}
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
                  title="Upload video"
                  fieldKey={path}
                  accept="video/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const binary = await readFileToBinary(file);
                      field.onChange(binary);
                      setVideoFile(file);
                    }
                  }}
                  disabled={disabled}
                />
              </Form.Control>
            </div>
            {videoFile ? (
              <FileListItem
                name={videoFile.name}
                onDelete={() => {
                  setVideoFile(null);
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
