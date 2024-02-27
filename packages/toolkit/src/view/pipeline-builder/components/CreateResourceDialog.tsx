import * as React from "react";
import { useShallow } from "zustand/react/shallow";
import { Dialog, Icons, ScrollArea } from "@instill-ai/design-system";
import {
  InstillStore,
  Nullable,
  useEntity,
  useInstillStore,
  useUserConnectors,
} from "../../../lib";
import { AirbyteDataResourceForm, DataResourceAutoForm } from "../../data";

import { ImageWithFallback } from "../../../components";
import { AIResourceAutoForm } from "../../ai";
import { ApplicationResourceAutoForm } from "../../application";
import { SelectConnectorDialogItem } from "./SelectConnectorDialogItem";

export type CreateResourceDialogProps = {
  accessToken: Nullable<string>;
  enableQuery: boolean;
};

const selector = (store: InstillStore) => ({
  state: store.createResourceDialogState,
  updateState: store.updateCreateResourceDialogState,
});

export const CreateResourceDialog = (props: CreateResourceDialogProps) => {
  const { accessToken, enableQuery } = props;
  const {
    state: {
      open,
      connectorDefinition,
      connectorType,
      onCreated,
      onSelectedExistingResource,
    },
    updateState,
  } = useInstillStore(useShallow(selector));

  const entityObject = useEntity();

  const existedConnectors = useUserConnectors({
    userName: entityObject.entityName,
    connectorType: connectorType ?? "all",
    accessToken,
    enabled: enableQuery && entityObject.isSuccess,
  });

  const filteredConnectors = React.useMemo(() => {
    if (!existedConnectors.isSuccess || !connectorDefinition) {
      return [];
    }

    return existedConnectors.data.filter(
      (connector) =>
        connector.connector_definition.id === connectorDefinition.id
    );
  }, [
    existedConnectors.data,
    existedConnectors.isSuccess,
    connectorDefinition,
  ]);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => {
        updateState((prev) => ({
          ...prev,
          open: e,
        }));
      }}
    >
      <Dialog.Content className="flex !max-w-[1048px] flex-col overflow-y-auto !p-0">
        <ScrollArea.Root className="h-[700px] p-6">
          <Dialog.Close className="bg-semantic-bg-primary" />
          <div className="flex flex-col">
            <div className="mb-5 flex flex-col ">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[10px] border border-semantic-bg-line shadow-xxs">
                <ImageWithFallback
                  src={`/icons/${connectorDefinition?.id}.svg`}
                  width={32}
                  height={32}
                  alt={`${connectorDefinition?.title}-icon`}
                  fallbackImg={
                    <Icons.IntersectSquare className="h-6 w-6 stroke-semantic-fg-primary" />
                  }
                />
              </div>
              <p className="text-semantic-fg-primary product-body-text-1-semibold">
                Set up your component
              </p>
              <p className="text-semantic-fg-disabled product-body-text-3-regular">
                Use the existing connector or create a new one
              </p>
            </div>

            <div className="mb-4 flex flex-col">
              <div className="mb-4 flex w-full bg-semantic-bg-base-bg py-2">
                <p className="mx-auto product-body-text-1-semibold">
                  Existing Connectors
                </p>
              </div>
              <div className="grid w-full grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3 lg:grid-cols-4">
                {filteredConnectors.map((connector) => (
                  <SelectConnectorDialogItem
                    key={connector.id}
                    onClick={() => {
                      if (!onSelectedExistingResource) return;
                      onSelectedExistingResource(connector);
                    }}
                  >
                    <ImageWithFallback
                      src={`/icons/${connector.connector_definition.id}.svg`}
                      width={32}
                      height={32}
                      alt={`${connector.connector_definition.title}-icon`}
                      fallbackImg={
                        <Icons.Box className="h-8 w-8 stroke-semantic-fg-primary" />
                      }
                    />
                    <p className="my-auto text-left text-semantic-fg-primary product-headings-heading-5">
                      {connector.id}
                    </p>
                  </SelectConnectorDialogItem>
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="mb-4 flex w-full bg-semantic-bg-base-bg py-2">
                <p className="mx-auto product-body-text-1-semibold">
                  Create a new connector
                </p>
              </div>
              {connectorType === "CONNECTOR_TYPE_AI" && connectorDefinition ? (
                <AIResourceAutoForm
                  definition={connectorDefinition}
                  resource={null}
                  accessToken={accessToken}
                  onSubmit={onCreated ? onCreated : undefined}
                  onBack={() => {
                    updateState(() => ({
                      open: false,
                      connectorType: null,
                      connectorDefinition: null,
                      onCreated: null,
                      onSelectedExistingResource: null,
                    }));
                  }}
                />
              ) : null}
              {connectorType === "CONNECTOR_TYPE_APPLICATION" &&
              connectorDefinition ? (
                <ApplicationResourceAutoForm
                  definition={connectorDefinition}
                  resource={null}
                  accessToken={accessToken}
                  onSubmit={onCreated ? onCreated : undefined}
                  onBack={() => {
                    updateState(() => ({
                      open: false,
                      connectorType: null,
                      connectorDefinition: null,
                      onCreated: null,
                      onSelectedExistingResource: null,
                    }));
                  }}
                />
              ) : null}
              {connectorType === "CONNECTOR_TYPE_DATA" &&
              connectorDefinition ? (
                connectorDefinition.id === "airbyte-destination" ? (
                  <AirbyteDataResourceForm
                    dataDefinition={connectorDefinition}
                    dataResource={null}
                    accessToken={accessToken}
                    enableBackButton={true}
                    onSubmit={onCreated ? onCreated : undefined}
                    onBack={() => {
                      updateState(() => ({
                        open: false,
                        connectorType: null,
                        connectorDefinition: null,
                        onCreated: null,
                        onSelectedExistingResource: null,
                      }));
                    }}
                    enableQuery={enableQuery}
                  />
                ) : (
                  <DataResourceAutoForm
                    definition={connectorDefinition}
                    resource={null}
                    accessToken={accessToken}
                    onSubmit={onCreated ? onCreated : undefined}
                    onBack={() => {
                      updateState(() => ({
                        open: false,
                        connectorType: null,
                        connectorDefinition: null,
                        onCreated: null,
                        onSelectedExistingResource: null,
                      }));
                    }}
                  />
                )
              ) : null}
            </div>
          </div>
        </ScrollArea.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
};
