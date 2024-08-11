import React from "react";

import { Button, Dialog, Icons, Tag } from "@instill-ai/design-system";

import { File } from "../../../lib/react-query-service/knowledge/types";
import {
  convertFileType,
  formatDate,
  formatFileSize,
  truncateName,
} from "./lib/helpers";
import { StatusTag } from "./StatusTag";

type FileTableRowProps = {
  item: File;
  index: number;
  handleFileClick: (file: File) => void;
  handleDelete: (fileUid: string) => void;
};
export const FileTableRow = ({
  item,
  handleFileClick,
  handleDelete,
}: FileTableRowProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setIsDeleteDialogOpen(false);
    handleDelete(item.fileUid);
  };
  return (
    <>
      <div className="grid h-[72px] grid-cols-[minmax(0,3fr)_1fr_1fr_1fr_1fr_2fr_1fr] items-center bg-semantic-bg-primary border border-semantic-bg-line">
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
          <Tag size="sm" variant="lightNeutral">
            {convertFileType(item.type)}
          </Tag>
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
          <div>{`${item.totalChunks ?? "N/A"} chunks, ${item.totalTokens} tokens`}</div>
        </div>
        <div className="flex items-center justify-center text-semantic-bg-secondary-alt-primary product-body-text-3-regular">
          {formatDate(item.createTime)}
        </div>
        <div className="flex items-center justify-center">
          <Button
            variant="tertiaryDanger"
            size="lg"
            className="h-8"
            onClick={handleDeleteClick}
          >
            Delete
          </Button>
        </div>
      </div>

      <Dialog.Root
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <Dialog.Content className="!w-[350px] rounded-sm !p-0">
          <div className="flex flex-col items-center justify-start gap-6 rounded-sm border border-b-semantic-bg-secondary p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-semantic-warning-bg p-3">
              <Icons.AlertTriangle className="h-6 w-6 stroke-semantic-warning-on-bg" />
            </div>
            <div className="flex flex-col items-start justify-start gap-6 self-stretch">
              <div className="flex flex-col items-center justify-center gap-1">
                <div className="product-headings-heading-3">
                  Delete {truncateName(item.name)}
                </div>
                <div className="text-center product-body-text-2-regular">
                  Are you sure you want to delete this file?
                </div>
              </div>
              <div className="flex w-full gap-2">
                <Button
                  variant="secondaryGrey"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="w-full"
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={confirmDelete}
                  className="w-full"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};
