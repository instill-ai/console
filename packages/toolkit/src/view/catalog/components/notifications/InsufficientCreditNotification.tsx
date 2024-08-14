"use client";

import { Button, Icons } from "@instill-ai/design-system";

type InsufficientCreditNotificationProps = {
  handleCloseInsufficientCreditMessage: () => void;
};

export const InsufficientCreditNotification = ({
  handleCloseInsufficientCreditMessage,
}: InsufficientCreditNotificationProps) => {
  return (
    <div className="fixed bottom-4 right-8 flex w-[400px] rounded-sm border border-semantic-bg-line bg-semantic-bg-primary p-4 shadow">
      <Icons.AlertCircle className="mr-4 h-6 w-6 stroke-semantic-error-on-bg" />
      <div className="mr-4 flex shrink grow basis-0 flex-col items-start justify-start gap-1 self-stretch">
        <div className="self-stretch product-body-text-2-semibold">
          Insufficient Credit
        </div>
        <div className="self-stretch text-semantic-fg-secondary product-body-text-3-regular">
          You have insufficient credit to process files. Please upgrade your
          plan or add more credit to continue.
        </div>
      </div>
      <Button
        className="absolute right-2 top-2"
        variant="tertiaryGrey"
        size="sm"
        onClick={handleCloseInsufficientCreditMessage}
      >
        <Icons.X className="h-6 w-6 stroke-semantic-fg-secondary" />
      </Button>
    </div>
  );
};
