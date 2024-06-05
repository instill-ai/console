"use client";

import cn from "clsx";
import { Button, Dialog, Icons, ScrollArea } from "@instill-ai/design-system";

import {
  ConnectorDefinition,
  IteratorDefinition,
  OperatorDefinition,
  useInstillStore,
} from "../../../../../lib";

import { DataTestID } from "../../../../../constant";
import { GenericSection } from "./GenericSection";
import { AISection } from "./AISection";
import { DataSection } from "./DataSection";
import { ApplicationSection } from "./ApplicationSection";
import { OpoeratorSection } from "./OpoeratorSection";

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
          <div className="mb-4 flex flex-row items-center gap-x-2">
            <div className="flex flex-1 justify-center rounded-sm bg-semantic-bg-base-bg py-2">
              <p className="text-semantic-fg-primary product-body-text-1-semibold">
                Components
              </p>
            </div>
            <button
              onClick={() => {
                onOpenChange(false);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-sm border border-semantic-bg-line bg-semantic-bg-primary shadow"
            >
              <Icons.X className="h-5 w-5 stroke-semantic-fg-primary" />
            </button>
          </div>
          {isEditingIterator ? null : <GenericSection onSelect={onSelect} />}
          <OpoeratorSection onSelect={onSelect} />
          <AISection onSelect={onSelect} />
          <DataSection onSelect={onSelect} />
          <ApplicationSection onSelect={onSelect} />
        </ScrollArea.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
};
