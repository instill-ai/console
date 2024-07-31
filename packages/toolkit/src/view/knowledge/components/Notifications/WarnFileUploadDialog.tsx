"use client";

import { Button, Dialog, Icons } from "@instill-ai/design-system";

export type WarnFileUploadDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onStay: () => void;
  onLeave: () => void;
};

const WarnFileUploadDialog = ({
  open,
  setOpen,
  onStay,
  onLeave,
}: WarnFileUploadDialogProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={(open) => setOpen(open)}>
      <Dialog.Content className="!w-[400px]">
        <div className="flex flex-col gap-y-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-semantic-warning-bg">
            <Icons.AlertTriangle className="h-6 w-6 stroke-semantic-warning-on-bg" />
          </div>
          <div className="flex flex-col">
            <Dialog.Title className="!mx-auto !product-headings-heading-3">
              File Upload in Progress
            </Dialog.Title>
            <Dialog.Description className="!mx-auto !text-center">
              You have a file uploading. Leaving the page will terminate the
              upload. Do you want to stay on this page to complete the file
              upload?
            </Dialog.Description>
          </div>
          <div className="flex flex-row gap-x-2">
            <Button
              onClick={onLeave}
              variant="secondaryGrey"
              size="lg"
              className="!flex-1 !px-2.5"
            >
              No
            </Button>
            <Button
              onClick={onStay}
              variant="primary"
              size="lg"
              className="!flex-1 !px-2.5"
            >
              Yes
            </Button>
          </div>
        </div>
        <Dialog.Close />
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default WarnFileUploadDialog;
