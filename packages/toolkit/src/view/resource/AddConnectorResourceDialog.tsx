import * as React from "react";
import { Button, Dialog, Icons } from "@instill-ai/design-system";

import { BlockchainResourceForm } from "../blockchain";
import { DataResourceForm } from "../data";
import {
  ConnectorDefinition,
  ConnectorResourceType,
  Nullable,
  useConnectorDefinitions,
} from "../../lib";
import { AIResourceForm } from "../ai";
import { ImageWithFallback } from "../../components";

export type AddConnectorResourceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactElement;
  accessToken: Nullable<string>;
  onSubmit: () => void;
  enableQuery: boolean;
};

export const AddConnectorResourceDialog = (
  props: AddConnectorResourceDialogProps
) => {
  const { open, onOpenChange, trigger, accessToken, enableQuery } = props;

  const [newConnectorDefinition, setNewConnectorDefinition] =
    React.useState<Nullable<ConnectorDefinition>>(null);
  const [newConnectorType, setNewConnectorType] =
    React.useState<Nullable<ConnectorResourceType>>(null);

  const aiDefinitions = useConnectorDefinitions({
    connectorResourceType: "CONNECTOR_TYPE_AI",
    enabled: enableQuery,
    accessToken,
  });

  const blockchainDefinitions = useConnectorDefinitions({
    connectorResourceType: "CONNECTOR_TYPE_BLOCKCHAIN",
    enabled: enableQuery,
    accessToken,
  });

  const dataDefinitions = useConnectorDefinitions({
    connectorResourceType: "CONNECTOR_TYPE_DATA",
    enabled: enableQuery,
    accessToken,
  });

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => {
        setNewConnectorDefinition(null);
        setNewConnectorType(null);
        onOpenChange(e);
      }}
    >
      <Dialog.Trigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button className="gap-x-2" variant="primary" size="lg">
            <Icons.Plus className="h-4 w-4 stroke-semantic-bg-primary" />
            Add resource
          </Button>
        )}
      </Dialog.Trigger>
      <Dialog.Content className="flex max-h-[700px] !max-w-[1048px] flex-col overflow-y-auto">
        {!newConnectorType ? (
          <>
            <Dialog.Header>
              <Dialog.Title className="mx-auto !product-headings-heading-3">
                Add a resource
              </Dialog.Title>
              <Dialog.Description className="mx-auto">
                Select a resource definition to create new resource
              </Dialog.Description>
            </Dialog.Header>
            <div className="flex flex-col">
              <div className="mb-4 flex w-full bg-semantic-bg-base-bg py-2">
                <p className="mx-auto product-body-text-1-semibold">
                  New Resource
                </p>
              </div>
              <div className="mb-4 text-semantic-fg-secondary product-body-text-3-medium">
                AI
              </div>
              <div className="mb-4 grid w-full grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3 lg:grid-cols-4">
                {aiDefinitions.isSuccess
                  ? aiDefinitions.data
                      .filter(
                        (definition) =>
                          definition.name !==
                          "connector-definitions/ai-hugging-face"
                      )
                      .map((definition) => (
                        <AddConnectorResourceDialogItem
                          key={definition.id}
                          onClick={() => {
                            setNewConnectorDefinition(definition);
                            setNewConnectorType("CONNECTOR_TYPE_AI");
                          }}
                        >
                          <ImageWithFallback
                            src={`/icons/${definition.vendor}/${definition.icon}`}
                            width={32}
                            height={32}
                            alt={`${definition.title}-icon`}
                            fallbackImg={
                              <Icons.Box className="h-8 w-8 stroke-semantic-fg-primary" />
                            }
                          />
                          <p className="my-auto text-left text-semantic-fg-primary product-headings-heading-5">
                            {definition.title}
                          </p>
                        </AddConnectorResourceDialogItem>
                      ))
                  : null}
              </div>
              <div className="mb-4 text-semantic-fg-secondary product-body-text-3-medium">
                Blockchain
              </div>
              <div className="mb-4 grid w-full grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3 lg:grid-cols-5">
                {blockchainDefinitions.isSuccess
                  ? blockchainDefinitions.data.map((definition) => (
                      <AddConnectorResourceDialogItem
                        key={definition.id}
                        onClick={() => {
                          setNewConnectorDefinition(definition);
                          setNewConnectorType("CONNECTOR_TYPE_BLOCKCHAIN");
                        }}
                      >
                        <ImageWithFallback
                          src={`/icons/${definition.vendor}/${definition.icon}`}
                          width={32}
                          height={32}
                          alt={`${definition.title}-icon`}
                          fallbackImg={
                            <Icons.Box className="h-8 w-8 stroke-semantic-fg-primary" />
                          }
                        />
                        <p className="my-auto text-left text-semantic-fg-primary product-headings-heading-5">
                          {definition.title}
                        </p>
                      </AddConnectorResourceDialogItem>
                    ))
                  : null}
              </div>
              <div className="mb-4 text-semantic-fg-secondary product-body-text-3-medium">
                Data
              </div>
              <div className="mb-4 grid w-full grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3 lg:grid-cols-4">
                {dataDefinitions.isSuccess
                  ? dataDefinitions.data.map((definition) => (
                      <AddConnectorResourceDialogItem
                        key={definition.id}
                        onClick={() => {
                          setNewConnectorDefinition(definition);
                          setNewConnectorType("CONNECTOR_TYPE_DATA");
                        }}
                      >
                        <ImageWithFallback
                          src={`/icons/${definition.vendor}/${definition.icon}`}
                          width={32}
                          height={32}
                          alt={`${definition.title}-icon`}
                          fallbackImg={
                            <Icons.Box className="h-8 w-8 stroke-semantic-fg-primary" />
                          }
                        />
                        <p className="my-auto text-left text-semantic-fg-primary product-headings-heading-5">
                          {definition.title}
                        </p>
                      </AddConnectorResourceDialogItem>
                    ))
                  : null}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col">
            <div className="mb-5 flex flex-col ">
              <div className="mb-4 flex h-12 w-12 rounded-[10px] border border-semantic-bg-line shadow-xxs">
                <Icons.IntersectSquare className="m-auto h-6 w-6 stroke-semantic-fg-secondary" />
              </div>
              <p className="text-semantic-fg-primary product-body-text-1-semibold">
                Add Resource
              </p>
              <p className="text-semantic-fg-disabled product-body-text-3-regular">
                Setup your resource to build your pipeline.
              </p>
            </div>
            {newConnectorType === "CONNECTOR_TYPE_AI" &&
            newConnectorDefinition ? (
              <AIResourceForm
                aiDefinition={newConnectorDefinition}
                aiResource={null}
                onSubmit={props.onSubmit}
                accessToken={accessToken}
                enableBackButton={true}
                onBack={() => {
                  setNewConnectorDefinition(null);
                  setNewConnectorType(null);
                }}
                enableQuery={enableQuery}
              />
            ) : null}
            {newConnectorType === "CONNECTOR_TYPE_BLOCKCHAIN" &&
            newConnectorDefinition ? (
              <BlockchainResourceForm
                blockchainDefinition={newConnectorDefinition}
                blockchainResource={null}
                onSubmit={props.onSubmit}
                accessToken={accessToken}
                enableBackButton={true}
                onBack={() => {
                  setNewConnectorDefinition(null);
                  setNewConnectorType(null);
                }}
                enableQuery={enableQuery}
              />
            ) : null}
            {newConnectorType === "CONNECTOR_TYPE_DATA" &&
            newConnectorDefinition ? (
              <DataResourceForm
                dataDefinition={newConnectorDefinition}
                dataResource={null}
                onSubmit={props.onSubmit}
                accessToken={accessToken}
                enableBackButton={true}
                onBack={() => {
                  setNewConnectorDefinition(null);
                  setNewConnectorType(null);
                }}
                enableQuery={enableQuery}
              />
            ) : null}
          </div>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
};

const AddConnectorResourceDialogItem = (
  props: {
    children: React.ReactNode;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
) => {
  const { children, onClick, ...passThrough } = props;
  return (
    <button
      className="flex w-[228px] cursor-pointer flex-row space-x-2 rounded border border-semantic-bg-line p-2 hover:bg-semantic-accent-bg"
      onClick={(e) => {
        if (onClick) {
          onClick(e);
        }
      }}
      {...passThrough}
    >
      <div className="my-auto flex flex-1 flex-row space-x-2">{children}</div>
      <div className="my-auto flex h-8 w-8 items-center justify-center">
        <Icons.Plus className="h-4 w-4 stroke-semantic-fg-secondary" />
      </div>
    </button>
  );
};
