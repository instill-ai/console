"use client";

import cn from "clsx";
import { Button, Dialog, Icons, ScrollArea } from "@instill-ai/design-system";

import {
  ConnectorDefinition,
  IteratorDefinition,
  OperatorDefinition,
  useInstillStore,
} from "../../../../../lib";
import { NewConnectorSection } from "./NewConnectorSection";
import { OperatorSection } from "./OperatorSection";
import { IteratorSection } from "./IteratorSection";
import { DataTestID } from "../../../../../constant";

export type OnSelectComponent = (
  definition: ConnectorDefinition | OperatorDefinition | IteratorDefinition
) => void;

export const SelectComponentDialog = ({
  open,
  onOpenChange,
  onSelect,
  disabled,
  disabledTrigger,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onSelect: OnSelectComponent;
  disabled?: boolean;
  disabledTrigger?: boolean;
}) => {
  const isEditingIterator = useInstillStore((store) => store.isEditingIterator);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {disabledTrigger ? null : (
        <Dialog.Trigger asChild>
          <Button
            disabled={disabled}
            className="!h-8 gap-x-2"
            variant="primary"
            size="lg"
          >
            Component
            <Icons.Plus
              className={cn(
                "h-4 w-4",
                disabled
                  ? "stroke-semantic-fg-secondary"
                  : "stroke-semantic-bg-primary"
              )}
            />
          </Button>
        </Dialog.Trigger>
      )}
      <Dialog.Content
        data-testid={DataTestID.SelectComponentDialog}
        className="flex !max-w-[1048px] flex-col overflow-y-auto !p-0"
      >
        <ScrollArea.Root className="h-[700px] p-6">
          <Dialog.Close className="bg-semantic-bg-primary" />
          <Dialog.Header className="mb-4">
            <Dialog.Title className="mx-auto !product-headings-heading-3">
              Select a component
            </Dialog.Title>
            <Dialog.Description className="mx-auto">
              Select a connector to add to your pipeline
            </Dialog.Description>
          </Dialog.Header>
          {isEditingIterator ? null : <IteratorSection onSelect={onSelect} />}
          <OperatorSection onSelect={onSelect} />
          <NewConnectorSection onSelect={onSelect} />
        </ScrollArea.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
};
