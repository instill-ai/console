import * as React from "react";

import { Button, Dialog, Icons } from "@instill-ai/design-system";
import { Nullable } from "@instill-ai/toolkit";

export type SelectConnectorDefinitionDialogProps = {
  children: React.ReactNode;
  type: "CONNECTOR_TYPE_AI" | "CONNECTOR_TYPE_DATA";
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const SelectConnectorDefinitionDialog = (
  props: SelectConnectorDefinitionDialogProps
) => {
  const { children, type, open, onOpenChange } = props;

  let dialogTitle: Nullable<string> = null;
  let dialogDescription: Nullable<string> = null;
  let connectorTypeName: Nullable<string> = null;

  switch (type) {
    case "CONNECTOR_TYPE_AI":
      dialogTitle = "Add a new AI";
      dialogDescription = "Select an AI to add to your pipeline";
      connectorTypeName = "AI";
      break;
    case "CONNECTOR_TYPE_DATA":
      dialogTitle = "Add a new data source";
      dialogDescription = "Select a data source to add to your pipeline";
      connectorTypeName = "Data";
      break;
  }
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <Button className="gap-x-2" variant="primary" size="lg">
          {connectorTypeName}
          <Icons.Plus className="h-4 w-4 stroke-semantic-bg-primary" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Content className="flex max-h-[480px] w-full !max-w-[1284px] flex-col overflow-y-auto">
        <Dialog.Header className="mb-4">
          <Dialog.Title className="mx-auto">{dialogTitle}</Dialog.Title>
          <Dialog.Description className="mx-auto">
            {dialogDescription}
          </Dialog.Description>
        </Dialog.Header>
        <div className="grid w-full grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3 lg:grid-cols-5">
          {children}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

const SelectConnectorDefinitionDialogItem = (
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

SelectConnectorDefinitionDialog.Item = SelectConnectorDefinitionDialogItem;
