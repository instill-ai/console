import * as React from "react";

import { Button, Icons } from "@instill-ai/design-system";

import { truncateName } from "../lib/functions";

type DuplicateFileNotificationProps = {
  deletedFileName: string;
  setShowDeleteMessage: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DuplicateFileNotification = ({
  deletedFileName,
  setShowDeleteMessage,
}: DuplicateFileNotificationProps) => {
  return (
    <div className="fixed bottom-4 right-8 flex  w-[400px] rounded-sm border border-semantic-bg-line bg-semantic-bg-primary p-4 shadow">
      <Icons.AlertTriangle className="mr-4 h-6 w-6 stroke-semantic-warning-on-bg" />
      <div className="flex flex-col justify-between overflow-hidden">
        <div className="flex flex-col items-start justify-start gap-1">
          <div className="product-body-text-2-semibold whitespace-pre-wrap overflow-hidden text-ellipsis">
            {truncateName(deletedFileName)}
            Already Uploaded or Exists in Catalog
          </div>
          <div className="text-semantic-fg-secondary product-body-text-3-regular overflow-hidden text-ellipsis whitespace-pre-wrap">
            Current catalog does not support uploading the same file twice.
            Please consider deleting the old file with the same name or renaming
            your new file before attempting to upload again.
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
