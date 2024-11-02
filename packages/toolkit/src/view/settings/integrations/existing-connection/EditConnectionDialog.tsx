"use client";

import { IntegrationConnection, Nullable } from "instill-sdk";

import { Button, Dialog } from "@instill-ai/design-system";

import {
  InstillStore,
  useGetIntegration,
  useGetNamespaceConnection,
  useInstillStore,
  useShallow,
} from "../../../../lib";
import { ConnectionForm, ConnectionFormOnSubmit } from "../ConnectionForm";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const EditConnectionDialog = ({
  integrationId,
  editingConnection,
  setEditingConnection,
  onSubmit,
  isProcessing,
  namespaceId,
}: {
  integrationId: string;
  editingConnection: Nullable<IntegrationConnection>;
  setEditingConnection: (connection: Nullable<IntegrationConnection>) => void;
  onSubmit: ConnectionFormOnSubmit;
  isProcessing: boolean;
  namespaceId: Nullable<string>;
}) => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const integrationFull = useGetIntegration({
    accessToken,
    enabled: enabledQuery && Boolean(editingConnection),
    view: "VIEW_FULL",
    integrationId,
  });

  const connectionFull = useGetNamespaceConnection({
    accessToken,
    enabled: enabledQuery && Boolean(editingConnection),
    view: "VIEW_FULL",
    connectionId: editingConnection?.id ?? null,
    namespaceId,
  });

  return (
    <Dialog.Root
      open={editingConnection !== null}
      onOpenChange={(open) => {
        if (!open) {
          setEditingConnection(null);
        }
      }}
    >
      <Dialog.Content
        className="h-auto overflow-hidden"
        style={{ width: "761px" }}
      >
        <Dialog.Header>
          <Dialog.Title>Edit Connection</Dialog.Title>
          <Dialog.Close
            onClick={() => setEditingConnection(null)}
            className="!right-6 !top-6"
          />
        </Dialog.Header>
        {editingConnection &&
        integrationFull.isSuccess &&
        connectionFull.isSuccess ? (
          <ConnectionForm
            id={`${editingConnection.id}-${editingConnection.method}`}
            method={editingConnection.method}
            schema={
              integrationFull.data.schemas.find(
                (item) => item.method === editingConnection.method,
              )?.schema
            }
            className="mt-6 max-h-[600px] overflow-y-auto"
            values={{
              ...connectionFull.data.setup,
              id: editingConnection.id,
            }}
            onSubmit={onSubmit}
            isProcessing={isProcessing}
            additionalCta={
              <Button
                variant="secondaryGrey"
                size="lg"
                onClick={() => setEditingConnection(null)}
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
