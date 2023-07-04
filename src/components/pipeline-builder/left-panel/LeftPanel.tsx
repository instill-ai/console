import { ReactNode } from "react";
import {
  ConnectorType,
  ImageWithFallback,
  Nullable,
  useConnectorDefinitions,
} from "@instill-ai/toolkit";
import { SelectConnectorDefinitionDialog } from "./SelectConnectorDefinitionDialog";
import { Icons, getModelDefinitionToolkit } from "@instill-ai/design-system";
import { PipelineBuilderStore, usePipelineBuilderStore } from "@/stores";
import { Node, Position, ReactFlowInstance } from "reactflow";
import { v4 as uuidv4 } from "uuid";
import { shallow } from "zustand/shallow";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
import { ConnectorNodeData } from "@/types";

export type LeftPanelProps = {
  selectedTab: Nullable<ConnectorType>;
  children: ReactNode;
  reactFlowInstance: Nullable<ReactFlowInstance>;
};

const pipelineBuilderSelector = (state: PipelineBuilderStore) => ({
  addNode: state.addNode,
});

export const LeftPanel = (props: LeftPanelProps) => {
  const { children, selectedTab, reactFlowInstance } = props;

  const { addNode } = usePipelineBuilderStore(pipelineBuilderSelector, shallow);

  const sourceDefinitions = useConnectorDefinitions({
    connectorType: "CONNECTOR_TYPE_SOURCE",
    enabled: selectedTab === "CONNECTOR_TYPE_SOURCE",
    accessToken: null,
  });

  const destinationDefinitions = useConnectorDefinitions({
    connectorType: "CONNECTOR_TYPE_DESTINATION",
    enabled: selectedTab === "CONNECTOR_TYPE_DESTINATION",
    accessToken: null,
  });

  const aiDefinitions = useConnectorDefinitions({
    connectorType: "CONNECTOR_TYPE_AI",
    enabled: selectedTab === "CONNECTOR_TYPE_AI",
    accessToken: null,
  });

  const blockchainDefinitions = useConnectorDefinitions({
    connectorType: "CONNECTOR_TYPE_BLOCKCHAIN",
    enabled: selectedTab === "CONNECTOR_TYPE_BLOCKCHAIN",
    accessToken: null,
  });

  return (
    <div className="flex w-full flex-col">
      {selectedTab === "CONNECTOR_TYPE_SOURCE" ? (
        <SelectConnectorDefinitionDialog type={selectedTab}>
          {sourceDefinitions.isSuccess
            ? sourceDefinitions.data.map((definition) => (
                <SelectConnectorDefinitionDialog.Item
                  key={definition.id}
                  onClick={() => {
                    if (!reactFlowInstance) return;

                    const viewport = reactFlowInstance.getViewport();

                    const newNode: Node<ConnectorNodeData> = {
                      id: uuidv4(),
                      type: "sourceNode",
                      sourcePosition: Position.Left,
                      targetPosition: Position.Right,
                      data: {
                        connectorType: "CONNECTOR_TYPE_SOURCE",
                        connector: {
                          id: definition.id,
                          name: `connectors/${definition.id}`,
                          connector_definition_name: definition.name,
                          connector_definition: definition,
                          watchState: "STATE_UNSPECIFIED",
                          configuration: {},
                        },
                      },
                      position: reactFlowInstance.project({
                        x: viewport.x,
                        y: viewport.y,
                      }),
                    };

                    addNode(newNode);
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
                    {definition.id}
                  </p>
                </SelectConnectorDefinitionDialog.Item>
              ))
            : null}
        </SelectConnectorDefinitionDialog>
      ) : null}
      {selectedTab === "CONNECTOR_TYPE_DESTINATION" ? (
        <SelectConnectorDefinitionDialog type={selectedTab}>
          {destinationDefinitions.isSuccess
            ? destinationDefinitions.data.map((definition) => (
                <SelectConnectorDefinitionDialog.Item
                  key={definition.id}
                  onClick={() => {
                    if (!reactFlowInstance) return;

                    const randomName: string = uniqueNamesGenerator({
                      dictionaries: [adjectives, colors, animals],
                      separator: "-",
                    });

                    const viewport = reactFlowInstance.getViewport();

                    const newNode: Node<ConnectorNodeData> = {
                      id: uuidv4(),
                      type: "destinationNode",
                      sourcePosition: Position.Left,
                      targetPosition: Position.Right,
                      data: {
                        connectorType: "CONNECTOR_TYPE_DESTINATION",
                        connector: {
                          id: randomName,
                          name: `connectors/${randomName}`,
                          connector_definition: definition,
                          connector_definition_name: definition.name,
                          configuration: {},
                          watchState: "STATE_UNSPECIFIED",
                        },
                      },
                      position: reactFlowInstance.project({
                        x: viewport.x,
                        y: viewport.y,
                      }),
                    };

                    addNode(newNode);
                  }}
                >
                  <ImageWithFallback
                    src={`/icons/${definition.vendor}/${definition.icon}`}
                    width={24}
                    height={24}
                    alt={`${definition.title}-icon`}
                    fallbackImg={
                      <Icons.Box className="my-auto h-6 w-6 stroke-semantic-fg-primary" />
                    }
                  />
                  <p className="my-auto text-left text-semantic-fg-primary product-headings-heading-5">
                    {definition.title}
                  </p>
                </SelectConnectorDefinitionDialog.Item>
              ))
            : null}
        </SelectConnectorDefinitionDialog>
      ) : null}
      {selectedTab === "CONNECTOR_TYPE_AI" ? (
        <SelectConnectorDefinitionDialog type={selectedTab}>
          {aiDefinitions.isSuccess
            ? aiDefinitions.data.map((definition) => {
                const { getIcon } = getModelDefinitionToolkit(definition.name);
                return (
                  <SelectConnectorDefinitionDialog.Item
                    key={definition.id}
                    onClick={() => {
                      if (!reactFlowInstance) return;

                      const randomName: string = uniqueNamesGenerator({
                        dictionaries: [adjectives, colors, animals],
                        separator: "-",
                      });

                      const viewport = reactFlowInstance.getViewport();

                      const newNode: Node<ConnectorNodeData> = {
                        id: uuidv4(),
                        type: "aiNode",
                        sourcePosition: Position.Left,
                        targetPosition: Position.Right,
                        data: {
                          connectorType: "CONNECTOR_TYPE_AI",
                          connector: {
                            id: randomName,
                            name: `connectors/${randomName}`,
                            connector_definition: definition,
                            connector_definition_name: definition.name,
                            watchState: "STATE_UNSPECIFIED",
                            configuration: {},
                          },
                        },
                        position: reactFlowInstance.project({
                          x: viewport.x,
                          y: viewport.y,
                        }),
                      };

                      addNode(newNode);
                    }}
                  >
                    {getIcon({
                      width: "w-[30px]",
                      height: "h-[30px]",
                      color: "fill-semantic-fg-primary",
                      position: "my-auto",
                    })}
                    <p className="my-auto text-left text-semantic-fg-primary product-headings-heading-5">
                      {definition.title}
                    </p>
                  </SelectConnectorDefinitionDialog.Item>
                );
              })
            : null}
        </SelectConnectorDefinitionDialog>
      ) : null}
      {selectedTab === "CONNECTOR_TYPE_BLOCKCHAIN" ? (
        <SelectConnectorDefinitionDialog type={selectedTab}>
          {blockchainDefinitions.isSuccess
            ? blockchainDefinitions.data.map((definition) => {
                return (
                  <SelectConnectorDefinitionDialog.Item
                    key={definition.id}
                    onClick={() => {
                      if (!reactFlowInstance) return;

                      const randomName: string = uniqueNamesGenerator({
                        dictionaries: [adjectives, colors, animals],
                        separator: "-",
                      });

                      const viewport = reactFlowInstance.getViewport();

                      const newNode: Node<ConnectorNodeData> = {
                        id: uuidv4(),
                        type: "blockchainNode",
                        sourcePosition: Position.Left,
                        targetPosition: Position.Right,
                        data: {
                          connectorType: "CONNECTOR_TYPE_BLOCKCHAIN",
                          connector: {
                            id: randomName,
                            name: `connectors/${randomName}`,
                            connector_definition: definition,
                            connector_definition_name: definition.name,
                            watchState: "STATE_UNSPECIFIED",
                            configuration: {},
                          },
                        },
                        position: reactFlowInstance.project({
                          x: viewport.x,
                          y: viewport.y,
                        }),
                      };

                      addNode(newNode);
                    }}
                  >
                    <ImageWithFallback
                      src={`/icons/${definition.vendor}/${definition.icon}`}
                      width={24}
                      height={24}
                      alt={`${definition.title}-icon`}
                      fallbackImg={
                        <Icons.CubeOutline className="my-auto h-6 w-6 stroke-semantic-fg-primary" />
                      }
                    />
                    <p className="my-auto text-left text-semantic-fg-primary product-headings-heading-5">
                      {definition.title}
                    </p>
                  </SelectConnectorDefinitionDialog.Item>
                );
              })
            : null}
        </SelectConnectorDefinitionDialog>
      ) : null}
      <div className="flex flex-1 flex-col space-y-4">{children}</div>
    </div>
  );
};
