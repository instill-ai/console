import * as React from "react";

import { Button, Dialog, Icons } from "@instill-ai/design-system";

export type SelectConnectorResourceDialogProps = {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const SelectConnectorResourceDialog = (
  props: SelectConnectorResourceDialogProps
) => {
  const { children, open, onOpenChange } = props;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <Button className="gap-x-2" variant="primary" size="lg">
          Add resource
          <Icons.Plus className="h-4 w-4 stroke-semantic-bg-primary" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Content className="flex max-h-[480px] w-full !max-w-[1284px] flex-col overflow-y-auto">
        <Dialog.Header className="mb-4">
          <Dialog.Title className="mx-auto">Add a resource</Dialog.Title>
          <Dialog.Description className="mx-auto">
            Select a resource to add to your pipeline
          </Dialog.Description>
        </Dialog.Header>
        <div className="flex flex-col">{children}</div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

const SelectConnectorResourceDialogItem = (
  props: {
    children: React.ReactNode;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
) => {
  const { children, onClick, ...passThrough } = props;
  return (
    <button
      className="flex w-[228px] cursor-pointer flex-row space-x-2 rounded border border-semantic-bg-line p-2 hover:bg-semantic-accent-bg"
      onClick={(e) => {
        if (onClick) {
          onClick(e);
        }
      }}
      {...passThrough}
    >
      <div className="my-auto flex flex-1 flex-row space-x-2">{children}</div>
      <div className="my-auto flex h-8 w-8 items-center justify-center">
        <Icons.Plus className="h-4 w-4 stroke-semantic-fg-secondary" />
      </div>
    </button>
  );
};

SelectConnectorResourceDialog.Item = SelectConnectorResourceDialogItem;
