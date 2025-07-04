"use client";

import * as React from "react";
import { Integration, IntegrationMethod, Nullable } from "instill-sdk";

import { Button, Dialog, Icons } from "@instill-ai/design-system";

import {
  InstillStore,
  toastInstillError,
  toastInstillSuccess,
  useCreateIntegrationConnection,
  useGetIntegration,
  useInstillStore,
  useShallow,
} from "../../../../lib";
import { ConnectionForm } from "../ConnectionForm";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const ManualSettingDialog = ({
  isOpen,
  onOpenChange,
  namespaceId,
  integration,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  namespaceId: Nullable<string>;
  integration: Integration;
}) => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const [isProcessing, setIsProcessing] = React.useState(false);

  const createIntegrationConnection = useCreateIntegrationConnection();

  const integrationFull = useGetIntegration({
    accessToken,
    enabled: enabledQuery && isOpen,
    view: "VIEW_FULL",
    integrationId: integration.id,
  });

  async function onSubmit({
    method,
    setup,
    newId,
  }: {
    method: IntegrationMethod;
    setup: Record<string, unknown>;
    newId?: string;
  }) {
    if (!namespaceId || !newId) {
      return;
    }

    setIsProcessing(true);

    try {
      await createIntegrationConnection.mutateAsync({
        payload: {
          method,
          id: newId,
          setup,
          integrationId: integration.id,
          namespaceId,
        },
        accessToken,
      });

      onOpenChange(false);

      toastInstillSuccess({
        title: `The ${integration.title} integration has been added!`,
      });
    } catch (error) {
      toastInstillError({
        title: "Something went wrong adding an integration",
        error,
      });
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Content
        className="h-auto overflow-hidden"
        style={{ width: "761px" }}
      >
        <div className="flex flex-row justify-between">
          <h3 className="product-headings-heading-3 my-auto text-semantic-fg-primary">
            Add Connection
          </h3>
          <button
            onClick={() => onOpenChange(false)}
            className="p-3 border hover:bg-semantic-bg-base-bg rounded-[10px] border-semantic-bg-line shadow-xxs"
          >
            <Icons.X className="w-6 h-6 stroke-semantic-fg-primary" />
          </button>
        </div>
        {integrationFull.isSuccess ? (
          <ConnectionForm
            id={integration.id}
            method="METHOD_DICTIONARY"
            schema={integrationFull.data.setupSchema}
            onSubmit={onSubmit}
            className="max-h-[600px] overflow-y-auto"
            isProcessing={isProcessing}
            additionalCta={
              <Button
                variant="secondaryGrey"
                size="lg"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            }
          />
        ) : null}
      </Dialog.Content>
    </Dialog.Root>
  );
};
