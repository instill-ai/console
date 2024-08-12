'use client';
import { Button, Icons } from "@instill-ai/design-system";

import { truncateName } from "../lib/helpers";

type FileSizeNotificationProps = {
  handleCloseFileTooLargeMessage: () => void;
  fileName: string;
  planMaxFileSize: number;
};

export const FileSizeNotification = ({
  handleCloseFileTooLargeMessage,
  fileName,
  planMaxFileSize,
}: FileSizeNotificationProps) => {
  return (
    <div className="fixed bottom-4 right-8 flex  w-[400px] rounded-sm border border-semantic-bg-line bg-semantic-bg-primary p-4 shadow">
      <Icons.AlertCircle className="mr-4 h-6 w-6 stroke-semantic-error-on-bg" />
      <div className="mr-4 flex shrink grow basis-0 flex-col items-start justify-start gap-1 self-stretch">
        <div className="self-stretch product-body-text-2-semibold">
          This file is too big
        </div>
        <div className="self-stretch product-body-text-2-semibold truncate">
          {truncateName(fileName)}
        </div>
        <div className="self-stretch text-semantic-fg-secondary product-body-text-3-regular">
          Please ensure your file is {planMaxFileSize / (1024 * 1024)} MB or
          smaller to upload it to the catalog. catalog.
        </div>
      </div>
      <Button
        className="absolute right-2 top-2"
        variant="tertiaryGrey"
        size="sm"
        onClick={handleCloseFileTooLargeMessage}
      >
        <Icons.X className="h-6 w-6 stroke-semantic-fg-secondary" />
      </Button>
    </div>
  );
};
