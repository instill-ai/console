"use client";

import * as React from "react";

import { cn, Icons, Input } from "@instill-ai/design-system";

type DragAndDropUploadProps = {
  onFileUpload: (file: File) => Promise<void>;
  planMaxFileSize: number;
  isLocalEnvironment: boolean;
};

export const DragAndDropUpload = ({
  onFileUpload,
  //planMaxFileSize,
  isLocalEnvironment,
}: DragAndDropUploadProps) => {
  const [isDragging, setIsDragging] = React.useState(false);

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
      )}
      style={{
        borderStyle: "dashed",
        borderWidth: "2px",
        borderRadius: "6px",
      }}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex cursor-pointer flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center text-semantic-fg-primary product-body-text-4-regular pb-2">
          <Icons.Upload01 className="mb-4 mt-10 h-8 w-8 stroke-semantic-fg-secondary" />
          <div className="w-full text-center">
            <span>Drag-and-drop file, or </span>
            <label
              htmlFor="upload-file-field"
              className="cursor-pointer text-semantic-accent-default"
            >
              browse computer
            </label>
            <div className="text-left pt-4">
              <div className="mb-2">
                <strong>Documents:</strong> TXT, MD, PDF, HTML, CSV, DOCX, DOC,
                PPTX, PPT, XLSX, XLS
              </div>
              <div className="mb-2">
                <strong>Images:</strong> PNG, JPG, JPEG, GIF, WEBP, TIFF, BMP,
                HEIC, HEIF, AVIF
              </div>
              <div className="mb-2">
                <strong>Audio:</strong> MP3, WAV, AAC, OGG, FLAC, M4A, WMA, AIFF
              </div>
              <div>
                <strong>Video:</strong> MP4, AVI, MOV, WEBM, MKV, FLV, WMV, MPEG
              </div>
            </div>
            {!isLocalEnvironment ? (
              <div className="">
                {/* Max {planMaxFileSize / (1024 * 1024)}MB each */}
                Max 512MB each
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <Input.Root className="hidden">
        <Input.Core
          id="upload-file-field"
          type="file"
          accept=".txt,.md,.pdf,.docx,.doc,.pptx,.ppt,.html,.xlsx,.xls,.csv,.png,.jpg,.jpeg,.gif,.webp,.tiff,.bmp,.heic,.heif,.avif,.mp3,.wav,.aac,.ogg,.flac,.m4a,.wma,.aiff,.mp4,.avi,.mov,.webm,.mkv,.flv,.wmv,.mpeg"
          multiple
          onChange={handleFileInputChange}
        />
      </Input.Root>
    </div>
  );
};
