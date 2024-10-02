"use client";

import * as React from "react";
import Image from "next/image";
import { Integration, IntegrationMethod, Nullable } from "instill-sdk";

import {
  Button,
  Dialog,
  Icons,
  TabMenu,
  useToast,
} from "@instill-ai/design-system";

import { AvailableOAuthIntegration } from "../../../constant";
import {
  initializeIntegrationConnection,
  InstillStore,
  toastInstillError,
  useAddIntegrationConnection,
  useInstillStore,
  useIntegration,
  useShallow,
} from "../../../lib";
import { IntegrationProvider } from "../../../server";
import { ConnectionForm } from "./ConnectionForm";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export type AvailableIntegrationProps = {
  integration: Integration;
  namespaceId: Nullable<string>;
};

export const AvailableIntegration = ({
  integration,
  namespaceId,
}: AvailableIntegrationProps) => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isConnectDialogOpen, setIsConnectDialogOpen] = React.useState(false);
  const [activeIntegrationMethod, setActiveIntegrationMethod] =
    React.useState<Nullable<IntegrationMethod>>(null);
  const addIntegrationConnection = useAddIntegrationConnection();

  const integrationFull = useIntegration({
    accessToken,
    enabled: enabledQuery && isConnectDialogOpen,
    view: "VIEW_FULL",
    integrationId: integration.id,
  });

  const oAuthIsAvailable = AvailableOAuthIntegration.includes(integration.id);

  React.useEffect(() => {
    if (oAuthIsAvailable) {
      setActiveIntegrationMethod("METHOD_OAUTH");
      return;
    }

    if (
      !integrationFull.isSuccess ||
      !integrationFull.data ||
      !integrationFull.data.schemas[0]
    ) {
      return;
    }

    setActiveIntegrationMethod(integrationFull.data.schemas[0].method);
  }, [integrationFull.isSuccess, integrationFull.data, oAuthIsAvailable]);

  async function onSubmit({
    method,
    payload,
    id,
  }: {
    method: IntegrationMethod;
    payload: Record<string, unknown>;
    id: string;
  }) {
    if (!namespaceId) {
      return;
    }

    if (method === "METHOD_OAUTH") {
      let provider: Nullable<IntegrationProvider> = null;

      switch (integration.id) {
        case "github":
          provider = "github";
          break;
        default:
          break;
      }

      if (provider) {
        initializeIntegrationConnection(
          provider,
          id,
          namespaceId,
          integration.id,
        );
      }

      return;
    }

    setIsProcessing(true);

    try {
      await addIntegrationConnection.mutateAsync({
        payload: {
          method,
          id,
          setup: payload,
          integrationId: integration.id,
          namespaceId,
        },
        accessToken,
      });

      setIsConnectDialogOpen(false);

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
    }

    setIsProcessing(false);
  }

  return (
    <div className="[&:not(:last-child)]:border-b [&:not(:last-child)]:border-semantic-bg-line flex flex-row gap-4 items-center p-4 w-full">
      <div className="w-12 h-12 rounded-sm border-semantic-bg-line border flex items-center justify-center">
        <Image
          width={24}
          height={24}
          src={`/icons/${integration.icon.split("/")[1]}`}
          alt={integration.title}
        />
      </div>
      <span className="text-semantic-fg-primary font-semibold text-base">
        {integration.title}
      </span>
      <Button
        variant="primary"
        className="ml-auto"
        onClick={() => setIsConnectDialogOpen(true)}
      >
        Connect
      </Button>
      <Dialog.Root
        open={isConnectDialogOpen}
        onOpenChange={setIsConnectDialogOpen}
      >
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
            <React.Fragment>
              {oAuthIsAvailable ? (
                <TabMenu.Root
                  value={activeIntegrationMethod}
                  onValueChange={(value: Nullable<string>) =>
                    setActiveIntegrationMethod(value as IntegrationMethod)
                  }
                  disabledDeSelect={true}
                  className="border-b border-semantic-bg-line"
                >
                  <TabMenu.Item
                    className="hover:!text-semantic-accent-default data-[selected=true]:!text-semantic-accent-default"
                    value="METHOD_OAUTH"
                  >
                    OAuth
                  </TabMenu.Item>
                  <TabMenu.Item
                    className="hover:!text-semantic-accent-default data-[selected=true]:!text-semantic-accent-default"
                    value="METHOD_DICTIONARY"
                  >
                    Manual Setting
                  </TabMenu.Item>
                </TabMenu.Root>
              ) : null}
              {activeIntegrationMethod ? (
                <ConnectionForm
                  key={activeIntegrationMethod}
                  id={`${integration.id}-${activeIntegrationMethod}`}
                  method={activeIntegrationMethod}
                  schema={
                    integrationFull.data.schemas.find(
                      (item) => item.method === activeIntegrationMethod,
                    )?.schema
                  }
                  onSubmit={onSubmit}
                  className="max-h-[600px] overflow-y-auto"
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
              ) : null}
            </React.Fragment>
          ) : null}
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
};
