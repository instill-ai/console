import * as React from "react";
import Image from "next/image";
import {
  Integration,
  IntegrationConnection,
  IntegrationMethod,
  Nullable,
} from "instill-sdk";

import {
  Accordion,
  Button,
  Dialog,
  Icons,
  useToast,
} from "@instill-ai/design-system";

import {
  CopiedTooltip,
  GeneralDeleteResourceDialog,
} from "../../../../components";
import {
  formatDate,
  useDeleteIntegrationConnection,
  useIntegration,
  useIntegrationConnection,
  useUpdateIntegrationConnection,
} from "../../../../lib";
import { ConnectionForm } from "./ConnectionForm";

export type ExistingConnectionProps = {
  integration: Integration;
  connections: IntegrationConnection[];
  namespaceId: Nullable<string>;
  accessToken: Nullable<string>;
  enableQuery: boolean;
};

export const ExistingConnection = ({
  integration,
  connections,
  namespaceId,
  enableQuery,
  accessToken,
}: ExistingConnectionProps) => {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [editConnection, setEditConnection] =
    React.useState<Nullable<IntegrationConnection>>(null);
  const [deleteConnection, setDeleteConnection] =
    React.useState<Nullable<IntegrationConnection>>(null);
  const { toast } = useToast();

  const updateIntegrationConnection = useUpdateIntegrationConnection();
  const deleteIntegrationConnection = useDeleteIntegrationConnection();

  const integrationFull = useIntegration({
    accessToken: accessToken || undefined,
    enabled: enableQuery && !!editConnection,
    view: "VIEW_FULL",
    integrationId: integration.id,
  });

  const connectionFull = useIntegrationConnection({
    accessToken: accessToken || undefined,
    enabled: enableQuery && !!editConnection,
    view: "VIEW_FULL",
    connectionId: editConnection?.id || null,
    namespaceId,
  });

  const ConnectionItem = ({
    connection,
  }: {
    connection: IntegrationConnection;
  }) => {
    const [copied, setCopied] = React.useState(false);

    return (
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 items-center">
          <span className="text-semantic-fg-primary font-semibold text-sm">
            {connection.id}
          </span>
          <CopiedTooltip isOpen={copied}>
            <Icons.Copy06
              className="w-4 h-4 stroke-semantic-fg-secondary cursor-pointer mr-auto"
              onClick={async () => {
                await navigator.clipboard.writeText(
                  `\${connection.${connection.id}}`,
                );
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 1000);
              }}
            />
          </CopiedTooltip>
          {/* <Button
            variant="secondaryGrey"
            className="ml-auto"
            size="sm"
            onClick={onTest}
          >
            Test
          </Button> */}
          <Icons.Edit05
            className="w-4 h-4 stroke-semantic-fg-secondary cursor-pointer"
            onClick={() => setEditConnection(connection)}
          />
          <Icons.Trash01
            className="w-4 h-4 stroke-semantic-fg-secondary cursor-pointer"
            onClick={() => setDeleteConnection(connection)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-row">
            <div className="w-32 text-semantic-fg-disabled text-sm font-normal">
              Date connected:
            </div>
            <div className="text-semantic-fg-primary text-sm font-normal">
              {formatDate(connection.createTime)}
            </div>
          </div>
          {/* <div className="flex flex-row">
            <div className="w-32 text-semantic-fg-disabled text-sm font-normal">
              Second element:
            </div>
            <div className="text-sm font-normal flex flex-col [&>a]:text-semantic-accent-default [&>a:hover]:underline">
              <a href="/">Link 1</a>
              <a href="/">Link 2</a>
            </div>
          </div> */}
        </div>
      </div>
    );
  };

  /* const onTest = () => {
    toast({
      size: "small",
      title: "Model readme updated successfully",
      variant: Math.random() > 0.5 ? "alert-success" : "alert-error",
    });
  }; */

  async function onSubmit(props: {
    method: IntegrationMethod;
    payload: Record<string, unknown>;
    id: string;
  }) {
    if (!namespaceId || !editConnection) {
      return;
    }

    setIsProcessing(true);

    await updateIntegrationConnection.mutateAsync({
      payload: {
        namespaceId,
        connectionId: editConnection.id,
        payload: {
          setup: props.payload,
        },
      },
      accessToken,
    });

    toast({
      size: "small",
      title: `The ${editConnection.id} connection has been updated!`,
      variant: "alert-success",
    });

    setIsProcessing(false);
    setEditConnection(null);
  }

  return (
    <Accordion.Item
      value={`item-${integration.id}`}
      className="[&:not(:last-child)]:border-b [&:not(:last-child)]:border-semantic-bg-line"
    >
      <Accordion.Trigger className="flex flex-row gap-4 items-center p-4 w-full [&[data-state=open]>svg]:rotate-180">
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
        <Icons.ChevronDown className="ml-auto h-5 w-5 stroke-semantic-fg-secondary transition-transform duration-200" />
      </Accordion.Trigger>
      <Accordion.Content
        className="mx-4 py-4 border-t border-semantic-bg-line flex-col gap-y-4 data-[state=open]:flex"
        style={{ width: "calc(100% - 32px)" }}
      >
        {connections.map((connection) => (
          <ConnectionItem key={connection.id} connection={connection} />
        ))}
      </Accordion.Content>
      <Dialog.Root open={editConnection !== null}>
        <Dialog.Content className="h-full md:h-auto lg:max-w-1/2 overflow-hidden">
          <Dialog.Header>
            <Dialog.Title>Edit Connection</Dialog.Title>
            <Dialog.Close
              onClick={() => setEditConnection(null)}
              className="!right-6 !top-6"
            />
          </Dialog.Header>
          {editConnection &&
          integrationFull.isSuccess &&
          connectionFull.isSuccess ? (
            <ConnectionForm
              isEdit
              id={`${editConnection.id}-${editConnection.method}`}
              method={editConnection.method}
              schema={
                integrationFull.data.schemas.find(
                  (item) => item.method === editConnection.method,
                )?.schema
              }
              values={{
                ...connectionFull.data.setup,
                id: editConnection.id,
              }}
              onSubmit={onSubmit}
              className="mt-6"
              isProcessing={isProcessing}
              additionalCta={
                <Button
                  variant="secondaryGrey"
                  size="lg"
                  onClick={() => setEditConnection(null)}
                >
                  Cancel
                </Button>
              }
            />
          ) : null}
        </Dialog.Content>
      </Dialog.Root>
      <GeneralDeleteResourceDialog
        open={deleteConnection !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteConnection(null);
          }
        }}
        resourceID={deleteConnection?.id || ""}
        title={`Delete ${deleteConnection?.id}`}
        description="This action cannot be undone. This will permanently delete this connection."
        handleDeleteResource={async () => {
          if (!namespaceId || !deleteConnection) {
            return;
          }

          await deleteIntegrationConnection.mutateAsync({
            namespaceId,
            connectionId: deleteConnection.id,
            accessToken,
          });

          setDeleteConnection(null);
        }}
        trigger={null}
      />
    </Accordion.Item>
  );
};
