"use client";

import * as React from "react";

import { cn, Icons, Input } from "@instill-ai/design-system";

type DragAndDropUploadProps = {
  onFileUpload: (file: File) => Promise<void>;
  planMaxFileSize: number;
  isLocalEnvironment: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export const DragAndDropUpload = ({
  onFileUpload,
  planMaxFileSize,
  isLocalEnvironment,
  className,
  style,
}: DragAndDropUploadProps) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    for (const file of files) {
      await onFileUpload(file);
    }
  };

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      await onFileUpload(file);
    }
  };

  return (
    <div
      className={cn(
        "flex w-full cursor-pointer flex-col items-center justify-center rounded bg-semantic-accent-bg text-semantic-fg-secondary product-body-text-4-regular",
        {
          "border-semantic-accent-default": isDragging,
          "border-semantic-bg-line": !isDragging,
        },
        className,
      )}
      style={
        style
          ? style
          : {
              borderStyle: "dashed",
              borderWidth: "2px",
              borderRadius: "6px",
            }
      }
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div
        onClick={() => {
          fileInputRef.current?.click();
        }}
        className="flex cursor-pointer flex-col items-center justify-center"
      >
        <div className="flex flex-col py-8 items-center justify-center text-semantic-fg-primary product-body-text-4-regular">
          <Icons.Upload01 className="h-8 w-8 stroke-semantic-fg-secondary" />
          <div className="w-full flex flex-col gap-y-1 text-center">
            <p>
              <span>Drag-and-drop file, or </span>
              <label
                htmlFor="upload-file-field"
                className="cursor-pointer text-semantic-accent-default"
              >
                browse computer
              </label>
            </p>
            <span>
              Support TXT, MARKDOWN, PDF, DOCX, DOC, PPTX, PPT, HTML, XLSX, XLS,
              CSV
            </span>
            {!isLocalEnvironment ? (
              <div className="">
                Max {Math.round(planMaxFileSize / (1024 * 1024))}MB each
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <Input.Root className="hidden">
        <Input.Core
          ref={fileInputRef}
          id="upload-file-field"
          type="file"
          accept=".txt,.md,.pdf,.docx,.doc,.pptx,.ppt,.html,.xlsx,.xls,.csv"
          multiple
          onChange={handleFileInputChange}
        />
      </Input.Root>
    </div>
  );
};
