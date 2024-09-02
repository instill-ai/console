import * as React from "react";

import {
  Accordion,
  Button,
  Dialog,
  Icons,
  useToast,
} from "@instill-ai/design-system";

import { GeneralDeleteResourceDialog } from "../../../../components";
import { ConnectionForm } from "./ConnectionForm";

export const ExistingConnection = ({ id }: { id: string }) => {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isConnectDialogOpen, setIsConnectDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const { toast } = useToast();

  const onTest = () => {
    toast({
      size: "small",
      title: "Model readme updated successfully",
      variant: Math.random() > 0.5 ? "alert-success" : "alert-error",
    });
  };

  async function onSubmit(props: { payload: Record<string, unknown> }) {
    setIsProcessing(true);

    console.log(props);

    setIsProcessing(false);
  }

  return (
    <Accordion.Item
      value={`item-${id}`}
      className="[&:not(:last-child)]:border-b [&:not(:last-child)]:border-semantic-bg-line"
    >
      <Accordion.Trigger className="flex flex-row gap-4 items-center p-4 w-full [&[data-state=open]>svg]:rotate-180">
        <div className="w-12 h-12 rounded-sm border-semantic-bg-line border flex items-center justify-center">
          1
        </div>
        <span className="text-semantic-fg-primary font-semibold text-base">
          Title
        </span>
        <Icons.ChevronDown className="ml-auto h-5 w-5 stroke-semantic-fg-secondary transition-transform duration-200" />
      </Accordion.Trigger>
      <Accordion.Content
        className="mx-4 py-4 border-t border-semantic-bg-line"
        style={{ width: "calc(100% - 32px)" }}
      >
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 items-center">
            <span className="text-semantic-fg-primary font-semibold text-sm">
              Title
            </span>
            <Icons.Copy06 className="w-4 h-4 stroke-semantic-fg-secondary" />
            <Button
              variant="secondaryGrey"
              className="ml-auto"
              size="sm"
              onClick={onTest}
            >
              Test
            </Button>
            <Icons.Edit05
              className="w-4 h-4 stroke-semantic-fg-secondary cursor-pointer"
              onClick={() => setIsConnectDialogOpen(true)}
            />
            <Icons.Trash01
              className="w-4 h-4 stroke-semantic-fg-secondary cursor-pointer"
              onClick={() => setIsDeleteDialogOpen(true)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex flex-row">
              <div className="w-32 text-semantic-fg-disabled text-sm font-normal">
                First element:
              </div>
              <div className="text-semantic-fg-primary text-sm font-normal">
                Data
              </div>
            </div>
            <div className="flex flex-row">
              <div className="w-32 text-semantic-fg-disabled text-sm font-normal">
                Second element:
              </div>
              <div className="text-sm font-normal flex flex-col [&>a]:text-semantic-accent-default [&>a:hover]:underline">
                <a href="/">Link 1</a>
                <a href="/">Link 2</a>
              </div>
            </div>
          </div>
        </div>
      </Accordion.Content>
      <Dialog.Root open={isConnectDialogOpen}>
        <Dialog.Content className="h-full md:h-auto lg:max-w-1/2 overflow-hidden">
          <Dialog.Header>
            <Dialog.Title>Edit Connection</Dialog.Title>
            <Dialog.Close
              onClick={() => setIsConnectDialogOpen(false)}
              className="!right-6 !top-6"
            />
          </Dialog.Header>
          <ConnectionForm
            id={id}
            method="METHOD_DICTIONARY"
            onSubmit={onSubmit}
            className="mt-6"
            isProcessing={isProcessing}
            additionalCta={
              <Button
                variant="secondaryGrey"
                size="lg"
                onClick={() => setIsConnectDialogOpen(false)}
              >
                Cancel
              </Button>
            }
          />
        </Dialog.Content>
      </Dialog.Root>
      <GeneralDeleteResourceDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => setIsDeleteDialogOpen(open)}
        resourceID={id}
        title={`Delete ${id}`}
        description="This action cannot be undone. This will permanently delete this connection."
        handleDeleteResource={async () => {
          //await handleDeletePipeline();
          setIsDeleteDialogOpen(false);
        }}
        trigger={null}
      />
    </Accordion.Item>
  );
};
