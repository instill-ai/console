import * as React from "react";
import Image from "next/image";
import { Integration, IntegrationMethod, Nullable } from "instill-sdk";

import { Button, Dialog, TabMenu, useToast } from "@instill-ai/design-system";

import { useAddIntegrationConnection, useIntegration } from "../../../../lib";
import { ConnectionForm } from "./ConnectionForm";

const METHOD_TITLE: Record<IntegrationMethod, string> = {
  METHOD_DICTIONARY: "Dictionary",
  METHOD_OAUTH: "oAuth",
};

export type AvailableIntegrationProps = {
  integration: Integration;
  accessToken: Nullable<string>;
  enableQuery: boolean;
  namespaceId: Nullable<string>;
};

export const AvailableIntegration = ({
  integration,
  accessToken,
  enableQuery,
  namespaceId,
}: AvailableIntegrationProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isConnectDialogOpen, setIsConnectDialogOpen] = React.useState(false);
  const [activeIntegrationMethod, setActiveIntegrationMethod] =
    React.useState<IntegrationMethod | null>(null);
  const addIntegrationConnection = useAddIntegrationConnection();

  const integrationFull = useIntegration({
    accessToken: accessToken || undefined,
    enabled: enableQuery && isConnectDialogOpen,
    view: "VIEW_FULL",
    integrationId: integration.id,
  });

  React.useEffect(() => {
    if (
      !integrationFull.isSuccess ||
      !integrationFull.data ||
      !integrationFull.data.schemas[0]
    ) {
      return;
    }

    setActiveIntegrationMethod(integrationFull.data.schemas[0].method);
  }, [integrationFull.isSuccess, integrationFull.data]);

  async function onSubmit(props: {
    method: IntegrationMethod;
    payload: Record<string, unknown>;
    id: string;
  }) {
    if (!namespaceId) {
      return;
    }

    setIsProcessing(true);

    await addIntegrationConnection.mutateAsync({
      payload: {
        method: props.method,
        id: props.id,
        setup: props.payload,
        integrationId: integration.id,
        namespaceId,
      },
      accessToken,
    });

    toast({
      size: "small",
      title: `The ${integration.title} integration has been added!`,
      variant: "alert-success",
    });

    setIsProcessing(false);
    setIsConnectDialogOpen(false);
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
      <Dialog.Root open={isConnectDialogOpen}>
        <Dialog.Content className="h-full md:h-auto lg:max-w-1/2 overflow-hidden">
          <Dialog.Header>
            <Dialog.Title>Add connection</Dialog.Title>
            <Dialog.Close
              onClick={() => setIsConnectDialogOpen(false)}
              className="!right-6 !top-6"
            />
          </Dialog.Header>
          {integrationFull.isSuccess ? (
            <React.Fragment>
              {integrationFull.data.schemas.length > 1 ? (
                <TabMenu.Root
                  value={activeIntegrationMethod}
                  onValueChange={(value: Nullable<string>) =>
                    setActiveIntegrationMethod(value as IntegrationMethod)
                  }
                  disabledDeSelect={true}
                  className="mb-3 border-b border-semantic-bg-line"
                >
                  {integrationFull.data.schemas.map((item) => (
                    <TabMenu.Item
                      key={item.method}
                      value={item.method}
                      className="hover:!text-semantic-accent-default data-[selected=true]:!text-semantic-accent-default"
                    >
                      <span className="text-sm">
                        {METHOD_TITLE[item.method]}
                      </span>
                    </TabMenu.Item>
                  ))}
                </TabMenu.Root>
              ) : null}
              {activeIntegrationMethod ? (
                <ConnectionForm
                  key={activeIntegrationMethod}
                  method={activeIntegrationMethod}
                  schema={
                    integrationFull.data.schemas.find(
                      (item) => item.method === activeIntegrationMethod,
                    )?.schema
                  }
                  id={`${integration.id}-${activeIntegrationMethod}`}
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
              ) : null}
            </React.Fragment>
          ) : null}
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
};
