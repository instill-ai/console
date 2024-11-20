import * as React from "react";
import { Nullable } from "instill-sdk";

import { Button, Form, Icons } from "@instill-ai/design-system";

import {
  AutoFormFieldBaseProps,
  StartOperatorFreeFormFieldBaseProps,
} from "../../types";
import { VideoPreview } from "../common";
import { AudioListItem } from "./AudioListItem";
import { FieldHead } from "./FieldHead";

export const FileAndStringUploadField = ({
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
  type,
}: StartOperatorFreeFormFieldBaseProps &
  AutoFormFieldBaseProps & { type: "file" | "image" | "audio" | "video" }) => {
  const [fileName, setFileName] = React.useState<Nullable<string>>(null);
  const [uploadedFile, setUploadedFiles] = React.useState<Nullable<File>>();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const accept = React.useMemo(() => {
    if (type === "image") return "image/*";
    if (type === "audio") return "audio/*";
    if (type === "video") return "video/*";
    return "*";
  }, [type]);

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
            <div className="flex w-full">
              <div
                className="relative w-full"
                onDrop={async (e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    setFileName(file.name);
                    field.onChange(file);
                    setUploadedFiles(file);
                  }
                }}
                onDragOver={handleDragOver}
              >
                <input
                  type="text"
                  value={fileName ?? ""}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setFileName(e.target.value);
                  }}
                  placeholder="Enter a URL, paste a file, or drag a file over."
                  className="w-full p-2 border rounded"
                  disabled={disabled}
                />
                <button
                  type="button"
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  disabled={disabled}
                >
                  <Icons.Upload01 className="w-4 h-4 stroke-semantic-fg-primary" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept={accept}
                  disabled={disabled}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      field.onChange(file);
                      setFileName(file.name);
                      setUploadedFiles(file);
                    }
                  }}
                />
              </div>
            </div>
            {uploadedFile && type !== "file" ? (
              <div className="flex flex-col gap-y-2 w-full p-2 rounded bg-semantic-bg-line">
                <div className="flex flex-row w-full justify-between items-center">
                  <p className="product-label-label-2 text-semantic-fg-disabled">
                    PREVIEW
                  </p>
                  <Button
                    className="flex flex-row gap-x-2 !px-2 !py-1.5"
                    variant="tertiaryGrey"
                    size="sm"
                    onClick={() => {
                      field.onChange(null);
                      setUploadedFiles(null);
                      setFileName(null);
                    }}
                  >
                    Clear
                    <Icons.X className="w-3 h-3 stroke-semantic-fg-primary" />
                  </Button>
                </div>
                {type === "image" ? (
                  <img
                    key={`${path}-${uploadedFile?.name}`}
                    src={URL.createObjectURL(uploadedFile)}
                    alt={`${path}-${uploadedFile?.name}`}
                    className="w-full object-contain max-h-[372px]"
                  />
                ) : null}
                {type === "audio" ? (
                  <AudioListItem
                    src={URL.createObjectURL(uploadedFile)}
                    name={uploadedFile.name}
                    diabledDeleteButton={true}
                  />
                ) : null}
                {type === "video" ? (
                  <VideoPreview
                    src={URL.createObjectURL(uploadedFile)}
                    className="max-h-[360px]"
                  />
                ) : null}
              </div>
            ) : null}
            <Form.Description
              className="nodrag nopan cursor-text select-text !text-xs"
              text={description}
            />
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};
