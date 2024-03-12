"use client";

import * as React from "react";
import { Button, Dialog, Icons } from "@instill-ai/design-system";
import { LoadingSpin } from "./LoadingSpin";

export type WarnUnsavedChangesDialogProps = {
  onCancel: () => void;
  onSave: () => Promise<void>;
  onDiscard: () => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const WarnUnsavedChangesDialog = ({
  onCancel,
  onDiscard,
  onSave,
  open,
  setOpen,
}: WarnUnsavedChangesDialogProps) => {
  const [isSaving, setIsSaving] = React.useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={(open) => setOpen(open)}>
      <Dialog.Content className="!w-[400px]">
        <div className="flex flex-col gap-y-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-semantic-warning-bg">
            <Icons.AlertTriangle className="h-6 w-6 stroke-semantic-warning-on-bg" />
          </div>
          <div className="flex flex-col">
            <Dialog.Title className="!mx-auto !product-headings-heading-3">
              Unsaved changes
            </Dialog.Title>
            <Dialog.Description className="!mx-auto !text-center">
              You have unsaved changes. Do you want to save the changes before
              leaving this page?
            </Dialog.Description>
          </div>
          <div className="flex flex-row gap-x-2">
            <Button
              onClick={() => {
                onCancel();
              }}
              variant="secondaryGrey"
              size="lg"
              className="!flex-1 !px-2.5"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                onDiscard();
              }}
              variant="danger"
              size="lg"
              className="!flex-1 !px-2.5"
            >
              Don&apos;t Save
            </Button>
            <Button
              onClick={async () => {
                if (isSaving) return;

                setIsSaving(true);
                try {
                  await onSave();
                  setOpen(false);
                } catch (e) {
                  setIsSaving(false);
                }
              }}
              variant="primary"
              size="lg"
              className="!flex-1 !px-2.5"
              disabled={isSaving}
            >
              {isSaving ? <LoadingSpin /> : "Save"}
            </Button>
          </div>
        </div>
        <Dialog.Close />
      </Dialog.Content>
    </Dialog.Root>
  );
};
