import cn from "clsx";
import * as React from "react";
import { Button, Dialog, Icons, ScrollArea } from "@instill-ai/design-system";

import {
  ConnectorDefinition,
  ConnectorResourceWithDefinition,
  Nullable,
  OperatorDefinition,
} from "../../../../lib";
import { ExistingConnectorSection } from "./ExistingConnectorSection";
import { NewConnectorSection } from "./NewConnectorSection";
import { OperatorSection } from "./OperatorSection";

export type SelectConnectorResourceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactElement;
  accessToken: Nullable<string>;
  onSelect: PipelineComponentDefinitionOnSelect;
  enableQuery: boolean;
  disabled: boolean;
};

export type PipelineComponentDefinitionOnSelect = (
  resource:
    | ConnectorResourceWithDefinition
    | ConnectorDefinition
    | OperatorDefinition
) => void;

export const SelectPipelineComponentDefinitionDialog = (
  props: SelectConnectorResourceDialogProps
) => {
  const {
    open,
    onOpenChange,
    trigger,
    accessToken,
    onSelect,
    enableQuery,
    disabled,
  } = props;

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => {
        onOpenChange(e);
      }}
    >
      <Dialog.Trigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            disabled={disabled}
            className="gap-x-2"
            variant="primary"
            size="lg"
          >
            <Icons.Plus
              className={cn(
                "h-5 w-5",
                disabled
                  ? "stroke-semantic-fg-secondary"
                  : "stroke-semantic-bg-primary"
              )}
            />
            Add component
          </Button>
        )}
      </Dialog.Trigger>
      <Dialog.Content className="flex !max-w-[1048px] flex-col overflow-y-auto !p-0">
        <ScrollArea.Root className="h-[700px] p-6">
          <Dialog.Close className="bg-semantic-bg-primary" />
          <Dialog.Header className="mb-4">
            <Dialog.Title className="mx-auto !product-headings-heading-3">
              Add a component
            </Dialog.Title>
            <Dialog.Description className="mx-auto">
              Select a connector to add to your pipeline
            </Dialog.Description>
          </Dialog.Header>

          <OperatorSection
            accessToken={accessToken}
            enableQuery={enableQuery}
            onSelect={onSelect}
          />

          <ExistingConnectorSection
            accessToken={accessToken}
            enableQuery={enableQuery}
            onSelect={onSelect}
          />

          <NewConnectorSection
            accessToken={accessToken}
            enableQuery={enableQuery}
            onSelect={onSelect}
          />
        </ScrollArea.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
};
