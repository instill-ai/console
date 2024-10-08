"use client";

import * as React from "react";
import { Integration, IntegrationMethod, Nullable } from "instill-sdk";

import { Button, Dialog, Icons, useToast } from "@instill-ai/design-system";

import {
  InstillStore,
  toastInstillError,
  useCreateIntegrationConnection,
  useInstillStore,
  useIntegration,
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
  const { toast } = useToast();
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const [isProcessing, setIsProcessing] = React.useState(false);

  const createIntegrationConnection = useCreateIntegrationConnection();

  const integrationFull = useIntegration({
    accessToken,
    enabled: enabledQuery && isOpen,
    view: "VIEW_FULL",
    integrationId: integration.id,
  });

  async function onSubmit({
    method,
    payload,
    newId,
  }: {
    method: IntegrationMethod;
    payload: Record<string, unknown>;
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
          setup: payload,
          integrationId: integration.id,
          namespaceId,
        },
        accessToken,
      });

      onOpenChange(false);

      toast({
        size: "small",
        title: `The ${integration.title} integration has been added!`,
        variant: "alert-success",
      });
    } catch (error) {
      toastInstillError({
        title: "Something went wrong adding an integration",
        error,
        toast,
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
          <button className="p-3 border hover:bg-semantic-bg-base-bg rounded-[10px] border-semantic-bg-line shadow-xxs">
            <Icons.X className="w-6 h-6 stroke-semantic-fg-primary" />
          </button>
        </div>
        {integrationFull.isSuccess ? (
          <ConnectionForm
            id={integration.id}
            method="METHOD_DICTIONARY"
            schema={
              integrationFull.data.schemas.find(
                (item) => item.method === "METHOD_DICTIONARY",
              )?.schema
            }
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
