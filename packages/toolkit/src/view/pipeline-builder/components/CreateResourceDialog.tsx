import * as React from "react";
import { Dialog, Icons } from "@instill-ai/design-system";
import { Nullable, useUserConnectorResources } from "../../../lib";
import { DataResourceForm } from "../../data";
import {
  PipelineBuilderStore,
  usePipelineBuilderStore,
} from "../usePipelineBuilderStore";
import { shallow } from "zustand/shallow";
import { useRouter } from "next/router";
import { SelectConnectorResourceDialogItem } from "./SelectConnectorResourceDialogItem";
import { ImageWithFallback } from "../../../components";
import { AIResourceAutoForm } from "../../ai";
import { BlockchainResourceAutoForm } from "../../blockchain";

export type CreateResourceDialogProps = {
  accessToken: Nullable<string>;
  enableQuery: boolean;
};

const selector = (state: PipelineBuilderStore) => ({
  state: state.createResourceDialogState,
  updateState: state.updateCreateResourceDialogState,
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
  } = usePipelineBuilderStore(selector, shallow);
  const router = useRouter();
  const { entity } = router.query;

  const existedConnectors = useUserConnectorResources({
    userName: `users/${entity}`,
    connectorResourceType: connectorType ?? "all",
    accessToken,
    enabled: enableQuery,
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
      <Dialog.Content className="flex max-h-[700px] !max-w-[1048px] flex-col overflow-y-auto">
        <div className="flex flex-col">
          <div className="mb-5 flex flex-col ">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[10px] border border-semantic-bg-line shadow-xxs">
              <ImageWithFallback
                src={`/icons/${connectorDefinition?.vendor}/${connectorDefinition?.icon}`}
                width={32}
                height={32}
                alt={`${connectorDefinition?.title}-icon`}
                fallbackImg={
                  <Icons.IntersectSquare className="h-6 w-6 stroke-semantic-fg-primary" />
                }
              />
            </div>
            <p className="text-semantic-fg-primary product-body-text-1-semibold">
              Add Resource
            </p>
            <p className="text-semantic-fg-disabled product-body-text-3-regular">
              Setup your resource to build your pipeline.
            </p>
          </div>

          <div className="mb-4 flex flex-col">
            <div className="mb-4 flex w-full bg-semantic-bg-base-bg py-2">
              <p className="mx-auto product-body-text-1-semibold">
                Existing Resource
              </p>
            </div>
            <div className="grid w-full grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3 lg:grid-cols-4">
              {filteredConnectors.map((connectorResource) => (
                <SelectConnectorResourceDialogItem
                  key={connectorResource.id}
                  onClick={() => {
                    if (!onSelectedExistingResource) return;
                    onSelectedExistingResource(connectorResource);
                  }}
                >
                  <ImageWithFallback
                    src={`/icons/${connectorResource.connector_definition.vendor}/${connectorResource.connector_definition.icon}`}
                    width={32}
                    height={32}
                    alt={`${connectorResource.connector_definition.title}-icon`}
                    fallbackImg={
                      <Icons.Box className="h-8 w-8 stroke-semantic-fg-primary" />
                    }
                  />
                  <p className="my-auto text-left text-semantic-fg-primary product-headings-heading-5">
                    {connectorResource.id}
                  </p>
                </SelectConnectorResourceDialogItem>
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="mb-4 flex w-full bg-semantic-bg-base-bg py-2">
              <p className="mx-auto product-body-text-1-semibold">
                Create new resource
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
            {connectorType === "CONNECTOR_TYPE_BLOCKCHAIN" &&
            connectorDefinition ? (
              <BlockchainResourceAutoForm
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
            {connectorType === "CONNECTOR_TYPE_DATA" && connectorDefinition ? (
              <DataResourceForm
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
            ) : null}
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};
