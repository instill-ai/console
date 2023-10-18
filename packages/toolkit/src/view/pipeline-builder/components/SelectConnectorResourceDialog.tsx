import cn from "clsx";
import * as React from "react";
import { Button, Dialog, Icons } from "@instill-ai/design-system";

import {
  ConnectorDefinition,
  ConnectorResourceWithDefinition,
  Nullable,
  useConnectorDefinitions,
  useUserConnectorResources,
} from "../../../lib";
import { ImageWithFallback } from "../../../components";
import { useRouter } from "next/router";
import { SelectConnectorResourceDialogItem } from "./SelectConnectorResourceDialogItem";

export type SelectConnectorResourceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactElement;
  accessToken: Nullable<string>;
  onSelect: (
    resource: ConnectorResourceWithDefinition | ConnectorDefinition
  ) => void;
  enableQuery: boolean;
  disabled: boolean;
};

export const SelectConnectorResourceDialog = (
  props: SelectConnectorResourceDialogProps
) => {
  const {
    open,
    onOpenChange,
    trigger,
    accessToken,
    onSelect,
    enableQuery,
    disabled,
  } = props;

  const router = useRouter();
  const { entity } = router.query;

  const allConnectorResources = useUserConnectorResources({
    userName: `users/${entity}`,
    connectorResourceType: "all",
    enabled: enableQuery,
    accessToken,
  });

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
        onOpenChange(e);
      }}
    >
      <Dialog.Trigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            disabled={disabled}
            className="gap-x-2"
            variant="primary"
            size="lg"
          >
            <Icons.Plus
              className={cn(
                "h-5 w-5",
                disabled
                  ? "stroke-semantic-fg-secondary"
                  : "stroke-semantic-bg-primary"
              )}
            />
            Add resource
          </Button>
        )}
      </Dialog.Trigger>
      <Dialog.Content className="flex max-h-[700px] !max-w-[1048px] flex-col overflow-y-auto">
        <>
          <Dialog.Header>
            <Dialog.Title className="mx-auto !product-headings-heading-3">
              Add a resource
            </Dialog.Title>
            <Dialog.Description className="mx-auto">
              Select a resource to add to your pipeline
            </Dialog.Description>
          </Dialog.Header>
          <div className="flex flex-col">
            <div className="mb-4 flex w-full bg-semantic-bg-base-bg py-2">
              <p className="mx-auto product-body-text-1-semibold">
                Existing Resource
              </p>
            </div>
            <div className="grid w-full grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3 lg:grid-cols-4">
              {allConnectorResources.isSuccess
                ? allConnectorResources.data.map((connectorResource) => (
                    <SelectConnectorResourceDialogItem
                      key={connectorResource.id}
                      onClick={() => {
                        onSelect(connectorResource);
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
                  ))
                : null}
            </div>
          </div>

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
                      <SelectConnectorResourceDialogItem
                        key={definition.id}
                        onClick={() => {
                          onSelect(definition);
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
                      </SelectConnectorResourceDialogItem>
                    ))
                : null}
            </div>
            <div className="mb-4 text-semantic-fg-secondary product-body-text-3-medium">
              Blockchain
            </div>
            <div className="mb-4 grid w-full grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3 lg:grid-cols-5">
              {blockchainDefinitions.isSuccess
                ? blockchainDefinitions.data.map((definition) => (
                    <SelectConnectorResourceDialogItem
                      key={definition.id}
                      onClick={() => {
                        onSelect(definition);
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
                    </SelectConnectorResourceDialogItem>
                  ))
                : null}
            </div>
            <div className="mb-4 text-semantic-fg-secondary product-body-text-3-medium">
              Data
            </div>
            <div className="mb-4 grid w-full grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3 lg:grid-cols-4">
              {dataDefinitions.isSuccess
                ? dataDefinitions.data.map((definition) => (
                    <SelectConnectorResourceDialogItem
                      key={definition.id}
                      onClick={() => {
                        onSelect(definition);
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
                    </SelectConnectorResourceDialogItem>
                  ))
                : null}
            </div>
          </div>
        </>
      </Dialog.Content>
    </Dialog.Root>
  );
};
