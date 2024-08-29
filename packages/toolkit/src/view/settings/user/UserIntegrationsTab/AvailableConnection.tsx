import * as React from "react";
import { UserExternalServiceConnectionRequest } from "instill-sdk";
import { z } from "zod";

import { Button, Dialog } from "@instill-ai/design-system";

import { ConnectionForm, ConnectionSchema } from "./ConnectionForm";

export const AvailableConnection = ({ id }: { id: string }) => {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isConnectDialogOpen, setIsConnectDialogOpen] = React.useState(false);

  async function onSubmit(data: z.infer<typeof ConnectionSchema>) {
    setIsProcessing(true);

    const payload: UserExternalServiceConnectionRequest = data;

    console.log(payload);

    setIsProcessing(false);
  }

  return (
    <div className="[&:not(:last-child)]:border-b [&:not(:last-child)]:border-semantic-bg-line flex flex-row gap-4 items-center p-4 w-full">
      <div className="w-12 h-12 rounded-sm border-semantic-bg-line border flex items-center justify-center">
        1
      </div>
      <span className="text-semantic-fg-primary font-semibold text-base">
        Title
      </span>
      <Button
        variant="primary"
        className="ml-auto"
        onClick={() => setIsConnectDialogOpen(true)}
      >
        Connect
      </Button>
      <Dialog.Root open={isConnectDialogOpen}>
        <Dialog.Content className="h-full md:h-auto lg:max-w-1/2 overflow-hidden">
          <Dialog.Header>
            <Dialog.Title>Add connection</Dialog.Title>
            <Dialog.Close
              onClick={() => setIsConnectDialogOpen(false)}
              className="!right-6 !top-6"
            />
          </Dialog.Header>
          <ConnectionForm
            id={id}
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
    </div>
  );
};
