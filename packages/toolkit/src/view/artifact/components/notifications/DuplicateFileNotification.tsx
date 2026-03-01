"use client";

import * as React from "react";
import Link from "next/link";

import { Button, Icons } from "@instill-ai/design-system";

import { truncateName } from "../lib/helpers";

type DuplicateFileNotificationProps = {
  deletedFileName: string;
  setShowDeleteMessage: React.Dispatch<React.SetStateAction<boolean>>;
  existingFileName?: string;
  existingFileLink?: string;
};

export const DuplicateFileNotification = ({
  deletedFileName,
  setShowDeleteMessage,
  existingFileName,
  existingFileLink,
}: DuplicateFileNotificationProps) => {
  const isContentDuplicate = existingFileName && existingFileLink;

  return (
    <div className="fixed bottom-4 right-8 flex  w-[400px] rounded-sm border border-semantic-bg-line bg-semantic-bg-primary p-4 shadow">
      <Icons.AlertTriangle className="mr-4 h-6 w-6 stroke-semantic-warning-on-bg" />
      <div className="flex flex-col justify-between overflow-hidden">
        <div className="flex flex-col items-start justify-start gap-1">
          <div className="product-body-text-2-semibold whitespace-pre-wrap overflow-hidden text-ellipsis">
            {isContentDuplicate
              ? `"${truncateName(deletedFileName)}" has identical content to an existing file`
              : `${truncateName(deletedFileName)} Already Uploaded or Exists in Knowledge Base`}
          </div>
          <div className="text-semantic-fg-secondary product-body-text-3-regular overflow-hidden text-ellipsis whitespace-pre-wrap">
            {isContentDuplicate ? (
              <>
                A file with the same content already exists:{" "}
                <Link
                  href={existingFileLink}
                  className="text-semantic-accent-default underline"
                >
                  {truncateName(existingFileName)}
                </Link>
              </>
            ) : (
              "Current knowledge base does not support uploading the same file twice. Please consider deleting the old file with the same name or renaming your new file before attempting to upload again."
            )}
          </div>
        </div>
      </div>
      <Button
        className="absolute right-2 top-2"
        variant="tertiaryGrey"
        size="sm"
        onClick={() => setShowDeleteMessage(false)}
      >
        <Icons.X className="h-6 w-6 stroke-semantic-fg-secondary" />
      </Button>
    </div>
  );
};
