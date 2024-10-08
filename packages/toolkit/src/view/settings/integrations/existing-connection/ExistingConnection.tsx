"use client";

import * as React from "react";
import Image from "next/image";
import { Integration, IntegrationConnection, Nullable } from "instill-sdk";

import { Accordion, Icons, useToast } from "@instill-ai/design-system";

import {
  InstillStore,
  toastInstillError,
  useInstillStore,
  useShallow,
  useUpdateIntegrationConnection,
} from "../../../../lib";
import { ConnectionItem } from "./ConnectionItem";
import { DeleteConnectionDialog } from "./DeleteConnectionDialog";
import { EditConnectionDialog } from "./EditConnectionDialog";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
});

export type ExistingConnectionProps = {
  integration: Integration;
  connections: IntegrationConnection[];
  namespaceId: Nullable<string>;
};

export function getAccordionId(integrationId: string) {
  return `accordion-item-${integrationId}`;
}

export const ExistingConnection = ({
  integration,
  connections,
  namespaceId,
}: ExistingConnectionProps) => {
  const { accessToken } = useInstillStore(useShallow(selector));
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [editingConnection, setEditingConnection] =
    React.useState<Nullable<IntegrationConnection>>(null);
  const [deleteConnection, setDeleteConnection] =
    React.useState<Nullable<IntegrationConnection>>(null);
  const { toast } = useToast();

  const updateIntegrationConnection = useUpdateIntegrationConnection();

  async function onSubmit({
    payload,
    newId,
  }: {
    payload: Record<string, unknown>;
    newId?: string;
  }) {
    if (!namespaceId || !editingConnection) {
      return;
    }

    setIsProcessing(true);

    try {
      await updateIntegrationConnection.mutateAsync({
        payload: {
          namespaceId,
          connectionId: editingConnection.id,
          payload: newId
            ? {
                id: newId,
                setup: {
                  ...payload,
                  id: undefined,
                },
              }
            : {
                setup: {
                  ...payload,
                  id: undefined,
                },
              },
        },
        accessToken,
      });

      setEditingConnection(null);

      toast({
        size: "small",
        title: `The ${editingConnection.id} connection has been updated!`,
        variant: "alert-success",
      });
    } catch (error) {
      console.log(error);
      toastInstillError({
        title: "Something went wrong adding an integration",
        error,
        toast,
      });
    }

    setIsProcessing(false);
  }

  return (
    <Accordion.Item
      value={getAccordionId(integration.id)}
      className="[&:not(:last-child)]:border-b [&:not(:last-child)]:border-semantic-bg-line bg-semantic-bg-primary"
    >
      <Accordion.Trigger className="flex flex-row gap-4 items-center p-4 w-full [&[data-state=open]>svg]:rotate-180">
        <div className="w-12 h-12 rounded-sm border-semantic-bg-line border shadow-xxs flex items-center justify-center">
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
        className="px-3 mx-auto w-full py-4 border-t border-semantic-bg-line flex-col gap-y-4 data-[state=open]:flex"
        style={{ width: "calc(100% - 32px)" }}
      >
        {connections.map((connection) => (
          <ConnectionItem
            key={connection.id}
            connection={connection}
            setEditingConnection={setEditingConnection}
            setDeleteConnection={setDeleteConnection}
            namespaceId={namespaceId}
          />
        ))}
      </Accordion.Content>
      <EditConnectionDialog
        editingConnection={editingConnection}
        setEditingConnection={setEditingConnection}
        integrationId={integration.id}
        onSubmit={onSubmit}
        isProcessing={isProcessing}
        namespaceId={namespaceId}
      />
      <DeleteConnectionDialog
        deletingConnection={deleteConnection}
        setDeletingConnection={setDeleteConnection}
        namespaceId={namespaceId}
      />
    </Accordion.Item>
  );
};
