import React from "react";
import { Button, Icons } from "@instill-ai/design-system";
import { File } from "../../../../../sdk/src/knowledge/types";
import { StatusTag } from "./StatusTag";

type FileTableRowProps = {
  item: File;
  index: number;
  handleFileClick: (file: File) => void;
  handleDelete: (fileUid: string) => void;
};

export const FileTableRow: React.FC<FileTableRowProps> = ({
  item,
  index,
  handleFileClick,
  handleDelete,
}) => {
  return (
    <div
      className={`grid h-[72px] grid-cols-[minmax(0,3fr)_1fr_1fr_1fr_1fr_2fr_1fr] items-center bg-semantic-bg-primary border border-semantic-bg-line ${
        index !== 0 ? "" : ""
      }`}
    >
      <div
        className="flex items-center justify-center px-4 truncate cursor-pointer text-semantic-bg-secondary-alt-primary product-body-text-3-regular"
        onClick={() => handleFileClick(item)}
      >
        <span className="truncate max-w-[200px]" title={item.name}>
          {item.name}
        </span>
        <Icons.ArrowUpRight className="w-4 h-4 stroke-semantic-bg-secondary-alt-primary ml-0.5 flex-shrink-0" />
      </div>
      <div className="flex items-center justify-center">
        <StatusTag status={item.type.replace("FILE_TYPE_", "")} />
      </div>
      <div className="flex items-center justify-center">
        <StatusTag
          status={item.processStatus.replace("FILE_PROCESS_STATUS_", "")}
        />
      </div>
      <div className="flex items-center justify-center text-semantic-bg-secondary-alt-primary product-body-text-3-regular">
        {formatFileSize(item.size)}
      </div>
      <div className="flex flex-col items-center justify-center text-semantic-bg-secondary-alt-primary product-body-text-3-regular">
        <div>{`${item.totalChunks ?? "N/A"} chunks`}</div>
      </div>
      <div className="flex items-center justify-center text-semantic-bg-secondary-alt-primary product-body-text-3-regular">
        {formatDate(item.createTime)}
      </div>
      <div className="flex items-center justify-center">
        <Button
          variant="tertiaryDanger"
          size="lg"
          className="h-8"
          onClick={() => handleDelete(item.fileUid)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

const formatFileSize = (bytes: number | undefined): string => {
  if (bytes === undefined || isNaN(bytes)) return "N/A";
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  if (i === 0) return bytes + " " + sizes[i];
  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString();
};
