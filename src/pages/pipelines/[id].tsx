import cn from "clsx";
import { FC, ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { useToast } from "@instill-ai/design-system";
import {
  ConnectorType,
  Nullable,
  useConnectorDefinitions,
  useConnectors,
  usePipeline,
  useWatchConnectors,
} from "@instill-ai/toolkit";
import { v4 as uuidv4 } from "uuid";
import { shallow } from "zustand/shallow";
import { Node, Position, ReactFlowInstance } from "reactflow";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

type GetLayOutProps = {
  page: ReactElement;
};

import {
  ConnectorWithWatchState,
  ConnectorNodeData,
  IncompleteConnectorWithWatchState,
} from "@/types";
import { PipelineBuilderStore, usePipelineBuilderStore } from "@/stores";
import {
  Draggable,
  Flow,
  LeftPanel,
  LeftSidebar,
  PageBase,
  PageHead,
  PipelineNameForm,
  RightPanel,
  Topbar,
} from "@/components";
import { useRouter } from "next/router";
import {
  createGraphLayout,
  createInitialGraphData,
  getAllConnectorPresets,
  getConnectorPresets,
} from "@/lib/pipeline-builder";

const pipelineBuilderSelector = (state: PipelineBuilderStore) => ({
  setPipelineId: state.setPipelineId,
  setPipelineUid: state.setPipelineUid,
  setPipelineDescription: state.setPipelineDescription,
  addNode: state.addNode,
  rightPanelIsOpen: state.rightPanelIsOpen,
  setNodes: state.setNodes,
  updateNodes: state.updateNodes,
  setEdges: state.setEdges,
  resourceFormIsDirty: state.resourceFormIsDirty,
  updateSelectedNode: state.updateSelectedNode,
});

export const DROPPABLE_AREA_ID = "pipeline-builder-droppable";

const PipelineBuilderPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const {
    setPipelineId,
    setPipelineUid,
    setPipelineDescription,
    addNode,
    rightPanelIsOpen,
    setNodes,
    setEdges,
    updateNodes,
    resourceFormIsDirty,
    updateSelectedNode,
  } = usePipelineBuilderStore(pipelineBuilderSelector, shallow);

  const router = useRouter();
  const { id } = router.query;

  // We need to warn user of unsave changes when they try to leave the page

  const pipeline = usePipeline({
    enabled: !!id,
    pipelineName: id ? `pipelines/${id}` : null,
    accessToken: null,
    retry: false,
  });

  const { toast } = useToast();

  const [selectedTab, setSelectedTab] = useState<Nullable<ConnectorType>>(
    "CONNECTOR_TYPE_SOURCE"
  );

  const [reactFlowInstance, setReactFlowInstance] =
    useState<Nullable<ReactFlowInstance>>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const sources = useConnectors({
    connectorType: "CONNECTOR_TYPE_SOURCE",
    accessToken: null,
    enabled: true,
  });

  const sourceDefinitions = useConnectorDefinitions({
    connectorType: "CONNECTOR_TYPE_SOURCE",
    accessToken: null,
    enabled: true,
  });

  const sourcesWatchState = useWatchConnectors({
    connectorType: "CONNECTOR_TYPE_SOURCE",
    connectorNames: sources.isSuccess
      ? sources.data.map((source) => source.name)
      : [],
    accessToken: null,
    enabled: sources.isSuccess && sources.data.length > 0,
  });

  const sourcesWithWatchState = useMemo<ConnectorWithWatchState[]>(() => {
    if (
      !sources.isSuccess ||
      !sources.data ||
      !sourcesWatchState.isSuccess ||
      !sourcesWatchState.data
    ) {
      return [];
    }

    return sources.data.map((source) => {
      return {
        ...source,
        watchState:
          `${source.name}` in sourcesWatchState.data
            ? sourcesWatchState.data[source.name].state
            : "STATE_UNSPECIFIED",
      };
    });
  }, [
    sources.isSuccess,
    sources.data,
    sourcesWatchState.isSuccess,
    sourcesWatchState.data,
  ]);

  const destinations = useConnectors({
    connectorType: "CONNECTOR_TYPE_DESTINATION",
    accessToken: null,
    enabled: true,
  });

  const destinationDefinitions = useConnectorDefinitions({
    connectorType: "CONNECTOR_TYPE_DESTINATION",
    accessToken: null,
    enabled: true,
  });

  const destinationsWatchState = useWatchConnectors({
    connectorType: "CONNECTOR_TYPE_DESTINATION",
    connectorNames: destinations.isSuccess
      ? destinations.data.map((destination) => destination.name)
      : [],
    accessToken: null,
    enabled: destinations.isSuccess && destinations.data.length > 0,
  });

  const destinationsWithWatchState = useMemo<ConnectorWithWatchState[]>(() => {
    if (
      !destinations.isSuccess ||
      !destinations.data ||
      !destinationsWatchState.isSuccess ||
      !destinationsWatchState.data
    ) {
      return [];
    }

    return destinations.data.map((destination) => {
      return {
        ...destination,
        watchState:
          `${destination.name}` in destinationsWatchState.data
            ? destinationsWatchState.data[destination.name].state
            : "STATE_UNSPECIFIED",
      };
    });
  }, [
    destinations.isSuccess,
    destinations.data,
    destinationsWatchState.isSuccess,
    destinationsWatchState.data,
  ]);

  const ais = useConnectors({
    connectorType: "CONNECTOR_TYPE_AI",
    accessToken: null,
    enabled: true,
  });

  const aiDefinitions = useConnectorDefinitions({
    connectorType: "CONNECTOR_TYPE_AI",
    accessToken: null,
    enabled: true,
  });

  const aisWatchState = useWatchConnectors({
    connectorType: "CONNECTOR_TYPE_AI",
    connectorNames: ais.isSuccess ? ais.data.map((ai) => ai.name) : [],
    accessToken: null,
    enabled: ais.isSuccess && ais.data.length > 0,
  });

  const aisWithWatchState = useMemo<ConnectorWithWatchState[]>(() => {
    if (
      !ais.isSuccess ||
      !ais.data ||
      !aisWatchState.isSuccess ||
      !aisWatchState.data
    ) {
      return [];
    }

    return ais.data.map((ai) => {
      return {
        ...ai,
        watchState:
          `${ai.name}` in aisWatchState.data
            ? aisWatchState.data[ai.name].state
            : "STATE_UNSPECIFIED",
      };
    });
  }, [ais.isSuccess, ais.data, aisWatchState.isSuccess, aisWatchState.data]);

  const blockchains = useConnectors({
    connectorType: "CONNECTOR_TYPE_BLOCKCHAIN",
    accessToken: null,
    enabled: true,
  });

  const blockchainDefinitions = useConnectorDefinitions({
    connectorType: "CONNECTOR_TYPE_BLOCKCHAIN",
    accessToken: null,
    enabled: true,
  });

  const blockchainsWatchState = useWatchConnectors({
    connectorType: "CONNECTOR_TYPE_BLOCKCHAIN",
    connectorNames: blockchains.isSuccess
      ? blockchains.data.map((ai) => ai.name)
      : [],
    accessToken: null,
    enabled: blockchains.isSuccess && blockchains.data.length > 0,
  });

  const blockchainsWithWatchState = useMemo<ConnectorWithWatchState[]>(() => {
    if (
      !blockchains.isSuccess ||
      !blockchains.data ||
      !blockchainsWatchState.isSuccess ||
      !blockchainsWatchState.data
    ) {
      return [];
    }

    return blockchains.data.map((blockchain) => {
      return {
        ...blockchain,
        watchState:
          `${blockchain.name}` in blockchainsWatchState.data
            ? blockchainsWatchState.data[blockchain.name].state
            : "STATE_UNSPECIFIED",
      };
    });
  }, [
    blockchains.isSuccess,
    blockchains.data,
    blockchainsWatchState.isSuccess,
    blockchainsWatchState.data,
  ]);

  /* -------------------------------------------------------------------------
   * Initialize pipeline id
   * -----------------------------------------------------------------------*/

  useEffect(() => {
    if (!pipeline.isSuccess) {
      console.log(id);
      if (id) {
        setPipelineId(id.toString());
      }
      return;
    }

    setPipelineUid(pipeline.data.uid);
    setPipelineId(pipeline.data.id);
    setPipelineDescription(pipeline.data.description);
  }, [
    pipeline.data,
    pipeline.isSuccess,
    setPipelineDescription,
    setPipelineId,
    setPipelineUid,
    id,
  ]);

  /* -------------------------------------------------------------------------
   * Initialize graph
   * -----------------------------------------------------------------------*/

  const [graphIsInitialized, setGraphIsInitialized] = useState(false);

  useEffect(() => {
    if (
      !pipeline.isSuccess ||
      !sources.isSuccess ||
      !destinations.isSuccess ||
      !ais.isSuccess ||
      !blockchains.isSuccess ||
      graphIsInitialized
    ) {
      return;
    }

    if (sources.data.length > 0 && !sourcesWatchState.isSuccess) {
      return;
    }

    if (destinations.data.length > 0 && !destinationsWatchState.isSuccess) {
      return;
    }

    if (ais.data.length > 0 && !aisWatchState.isSuccess) {
      return;
    }

    if (blockchains.data.length > 0 && !blockchainsWatchState.isSuccess) {
      return;
    }

    const initialData = createInitialGraphData({
      pipeline: pipeline.data,
      ais: aisWithWatchState,
      sources: sourcesWithWatchState,
      destinations: destinationsWithWatchState,
      blockchains: blockchainsWithWatchState,
    });

    createGraphLayout(initialData.nodes, initialData.edges)
      .then((graphData) => {
        setNodes(graphData.nodes);
        setEdges(graphData.edges);
      })
      .catch((err) => {
        console.log(err);
      });

    setGraphIsInitialized(true);
  }, [
    pipeline.isSuccess,
    pipeline.data?.uid,
    setPipelineId,
    setPipelineUid,
    graphIsInitialized,
    pipeline.data,
    setNodes,
    setEdges,
    ais.isSuccess,
    ais.data?.length,
    aisWatchState.isSuccess,
    aisWithWatchState,
    sources.isSuccess,
    sources.data?.length,
    sourcesWatchState.isSuccess,
    sourcesWithWatchState,
    destinations.isSuccess,
    destinations.data?.length,
    destinationsWatchState.isSuccess,
    destinationsWithWatchState,
    blockchains.isSuccess,
    blockchains.data?.length,
    blockchainsWatchState.isSuccess,
    blockchainsWithWatchState,
  ]);

  /* -------------------------------------------------------------------------
   * Update the nodes and edges
   * -----------------------------------------------------------------------*/

  useEffect(() => {
    updateNodes((prev) => {
      return prev.map((node) => {
        const ai = aisWithWatchState.find(
          (ai) => ai.name === node.data.connector.name
        );

        if (ai) {
          node.data = {
            connectorType: "CONNECTOR_TYPE_AI",
            connector: ai,
          };
          return node;
        }

        const source = sourcesWithWatchState.find(
          (source) => source.name === node.data.connector.name
        );

        if (source) {
          node.data = {
            connectorType: "CONNECTOR_TYPE_SOURCE",
            connector: source,
          };
          return node;
        }

        const destination = destinationsWithWatchState.find(
          (destination) => destination.name === node.data.connector.name
        );

        if (destination) {
          node.data = {
            connectorType: "CONNECTOR_TYPE_DESTINATION",
            connector: destination,
          };
          return node;
        }

        const blockchain = blockchainsWithWatchState.find(
          (blockchain) => blockchain.name === node.data.connector.name
        );

        if (blockchain) {
          node.data = {
            connectorType: "CONNECTOR_TYPE_BLOCKCHAIN",
            connector: blockchain,
          };
          return node;
        }

        return node;
      });
    });

    const allConnectors = [
      ...sourcesWithWatchState,
      ...destinationsWithWatchState,
      ...aisWithWatchState,
      ...blockchainsWithWatchState,
    ];

    updateSelectedNode((prev) => {
      if (!prev) return prev;

      const selectedConnector = allConnectors.find((connector) => {
        return connector.name === prev?.data.connector.name;
      });

      if (selectedConnector) {
        return {
          ...prev,
          data: {
            ...prev?.data,
            connector: selectedConnector,
          },
        };
      }

      return prev;
    });
  }, [
    aisWithWatchState,
    sourcesWithWatchState,
    destinationsWithWatchState,
    blockchainsWithWatchState,
    updateSelectedNode,
    updateNodes,
  ]);

  const [draggedItem, setDraggedItem] =
    useState<
      Nullable<ConnectorWithWatchState | IncompleteConnectorWithWatchState>
    >(null);

  const dropOverlayRef = useRef<HTMLDivElement>(null);

  function handleDragStart({ active }: DragStartEvent) {
    if (
      !sourceDefinitions.isSuccess ||
      !destinationDefinitions.isSuccess ||
      !aiDefinitions.isSuccess ||
      !blockchainDefinitions.isSuccess
    ) {
      return;
    }

    const allPresets = getAllConnectorPresets([
      ...sourceDefinitions.data,
      ...destinationDefinitions.data,
      ...aiDefinitions.data,
      ...blockchainDefinitions.data,
    ]);

    console.log(active.data.current?.isPreset, active.id);

    if (active.data.current?.isPreset) {
      const draggedItem =
        allPresets.find((e) => `${e.name}-preset` === active.id) || null;
      setDraggedItem(draggedItem);
      return;
    }

    const allConnectors = [
      ...sourcesWithWatchState,
      ...destinationsWithWatchState,
      ...aisWithWatchState,
      ...blockchainsWithWatchState,
    ];

    const draggedItem = allConnectors.find((e) => e.name === active.id) || null;

    setDraggedItem(draggedItem);
  }

  function handleDragCancel() {
    setDraggedItem(null);
  }

  function handleDragEnd(event: DragEndEvent) {
    if (resourceFormIsDirty) {
      toast({
        title: "You have unsaved changes",
        description:
          "Please save or discard your changes before editing another resource.",
        size: "large",
        variant: "alert-warning",
      });
      return;
    }

    if (
      !reactFlowInstance ||
      !reactFlowWrapper.current ||
      !dropOverlayRef.current ||
      !draggedItem
    ) {
      return;
    }

    if (event.over?.id !== DROPPABLE_AREA_ID) {
      return;
    }

    const overlayPosition = dropOverlayRef.current.getBoundingClientRect();
    const reactFlowPosition = reactFlowWrapper.current.getBoundingClientRect();

    let newNode: Nullable<Node<ConnectorNodeData>> = null;

    let id: Nullable<string> = null;
    let name: Nullable<string> = null;

    if (event.active.data.current?.isPreset) {
      if (
        draggedItem.name === "connectors/source-grpc" ||
        draggedItem.name === "connectors/source-http" ||
        draggedItem.name === "connectors/destination-http" ||
        draggedItem.name === "connectors/destination-grpc"
      ) {
        id = draggedItem.id;
        name = draggedItem.name;
      } else {
        const randomId = uniqueNamesGenerator({
          dictionaries: [adjectives, colors, animals],
          separator: "-",
        });

        id = randomId;
        name = `connectors/${randomId}`;
      }
    } else {
      id = draggedItem.id;
      name = draggedItem.name;
    }

    switch (draggedItem.connector_type) {
      case "CONNECTOR_TYPE_AI": {
        newNode = {
          id: uuidv4(),
          type: "aiNode",
          sourcePosition: Position.Left,
          targetPosition: Position.Right,
          data: {
            connectorType: "CONNECTOR_TYPE_AI",
            connector: {
              ...draggedItem,
              id,
              name,
            },
          },
          position: reactFlowInstance.project({
            x: overlayPosition.left - reactFlowPosition.left,
            y: overlayPosition.top - reactFlowPosition.top,
          }),
        };
        break;
      }
      case "CONNECTOR_TYPE_SOURCE": {
        newNode = {
          id: uuidv4(),
          type: "sourceNode",
          sourcePosition: Position.Left,
          targetPosition: Position.Right,
          data: {
            connectorType: "CONNECTOR_TYPE_SOURCE",
            connector: {
              ...draggedItem,
              id,
              name,
            },
          },
          position: reactFlowInstance.project({
            x: overlayPosition.left - reactFlowPosition.left,
            y: overlayPosition.top - reactFlowPosition.top,
          }),
        };
        break;
      }
      case "CONNECTOR_TYPE_DESTINATION": {
        newNode = {
          id: uuidv4(),
          type: "destinationNode",
          sourcePosition: Position.Left,
          targetPosition: Position.Right,
          data: {
            connectorType: "CONNECTOR_TYPE_DESTINATION",
            connector: {
              ...draggedItem,
              id,
              name,
            },
          },
          position: reactFlowInstance.project({
            x: overlayPosition.left - reactFlowPosition.left,
            y: overlayPosition.top - reactFlowPosition.top,
          }),
        };
        break;
      }
      case "CONNECTOR_TYPE_BLOCKCHAIN": {
        newNode = {
          id: uuidv4(),
          type: "blockchainNode",
          sourcePosition: Position.Left,
          targetPosition: Position.Right,
          data: {
            connectorType: "CONNECTOR_TYPE_BLOCKCHAIN",
            connector: {
              ...draggedItem,
              id,
              name,
            },
          },
          position: reactFlowInstance.project({
            x: overlayPosition.left - reactFlowPosition.left,
            y: overlayPosition.top - reactFlowPosition.top,
          }),
        };
        break;
      }
      default:
        console.error(`Unknown component type: ${draggedItem.connector_type}`);
    }

    if (!newNode) {
      return setDraggedItem(null);
    }

    addNode(newNode);
    setDraggedItem(null);
  }

  return (
    <>
      <PageBase>
        <Topbar>
          <div className="flex px-3 py-2">
            <PipelineNameForm />
          </div>
        </Topbar>
        <PageBase.Container>
          <style jsx>
            {`
              .pipeline-builder {
                --sidebar-width: 96px;
                --left-panel-width: 256px;
                --right-panel-width: 456px;
              }
            `}
          </style>
          <PageHead title="pipeline-builder" />
          <DndContext
            onDragStart={handleDragStart}
            onDragCancel={handleDragCancel}
            onDragEnd={handleDragEnd}
            autoScroll={false}
          >
            <DragOverlay dropAnimation={null}>
              <div ref={dropOverlayRef}>
                {draggedItem ? <Draggable.Item resource={draggedItem} /> : null}
              </div>
            </DragOverlay>
            <div className="pipeline-builder flex h-[calc(100vh-var(--topbar-height))] w-full flex-row overflow-x-hidden bg-semantic-bg-base-bg">
              <div className="z-30 flex w-[var(--sidebar-width)] flex-col bg-semantic-bg-primary">
                <LeftSidebar
                  selectedTab={selectedTab}
                  setSelectedTab={setSelectedTab}
                />
              </div>
              <div
                className={cn(
                  "flex w-[var(--left-panel-width)] transform flex-col bg-semantic-bg-primary px-4 pt-9 duration-500",
                  selectedTab === null ? "-ml-[var(--left-panel-width)]" : ""
                )}
              >
                <LeftPanel
                  selectedTab={selectedTab}
                  reactFlowInstance={reactFlowInstance}
                >
                  {selectedTab === "CONNECTOR_TYPE_SOURCE" ? (
                    <>
                      <LeftPanel.Section title="My Sources">
                        {sourcesWithWatchState
                          .filter(
                            (e) =>
                              e.visibility === "VISIBILITY_PRIVATE" ||
                              e.visibility === "VISIBILITY_UNSPECIFIED"
                          )
                          .map((e) => (
                            <Draggable.Root
                              isPreset={false}
                              key={e.name}
                              id={e.name}
                            >
                              <Draggable.Item resource={e} />
                            </Draggable.Root>
                          ))}
                      </LeftPanel.Section>
                      <LeftPanel.Section title="Others' Sources">
                        {sourcesWithWatchState
                          .filter((e) => e.visibility === "VISIBILITY_PUBLIC")
                          .map((e) => (
                            <Draggable.Root
                              isPreset={false}
                              key={e.name}
                              id={e.name}
                            >
                              <Draggable.Item resource={e} />
                            </Draggable.Root>
                          ))}
                      </LeftPanel.Section>
                      <LeftPanel.Section title="Popular Presets">
                        {sourceDefinitions.isSuccess
                          ? getConnectorPresets(
                              "CONNECTOR_TYPE_SOURCE",
                              sourceDefinitions.data
                            ).map((e) => (
                              <Draggable.Root
                                isPreset={true}
                                key={`${e.name}-preset`}
                                id={`${e.name}-preset`}
                              >
                                <Draggable.Item resource={e} />
                              </Draggable.Root>
                            ))
                          : null}
                      </LeftPanel.Section>
                    </>
                  ) : null}
                  {selectedTab === "CONNECTOR_TYPE_AI" ? (
                    <>
                      <LeftPanel.Section title="My AIs">
                        {aisWithWatchState
                          .filter(
                            (e) =>
                              e.visibility === "VISIBILITY_PRIVATE" ||
                              e.visibility === "VISIBILITY_UNSPECIFIED"
                          )
                          .map((e) => (
                            <Draggable.Root
                              isPreset={false}
                              key={e.name}
                              id={e.name}
                            >
                              <Draggable.Item resource={e} />
                            </Draggable.Root>
                          ))}
                      </LeftPanel.Section>
                      <LeftPanel.Section title="Others' AIs">
                        {aisWithWatchState
                          .filter((e) => e.visibility === "VISIBILITY_PUBLIC")
                          .map((e) => (
                            <Draggable.Root
                              isPreset={false}
                              key={e.name}
                              id={e.name}
                            >
                              <Draggable.Item resource={e} />
                            </Draggable.Root>
                          ))}
                      </LeftPanel.Section>
                      <LeftPanel.Section title="Popular Presets">
                        {aiDefinitions.isSuccess
                          ? getConnectorPresets(
                              "CONNECTOR_TYPE_AI",
                              aiDefinitions.data
                            ).map((e) => (
                              <Draggable.Root
                                isPreset={true}
                                key={`${e.name}-preset`}
                                id={`${e.name}-preset`}
                              >
                                <Draggable.Item resource={e} />
                              </Draggable.Root>
                            ))
                          : null}
                      </LeftPanel.Section>
                    </>
                  ) : null}
                  {selectedTab === "CONNECTOR_TYPE_DESTINATION" ? (
                    <>
                      <LeftPanel.Section title="My Destinations">
                        {destinationsWithWatchState
                          .filter(
                            (e) =>
                              e.visibility === "VISIBILITY_PRIVATE" ||
                              e.visibility === "VISIBILITY_UNSPECIFIED"
                          )
                          .map((e) => (
                            <Draggable.Root
                              isPreset={false}
                              key={e.name}
                              id={e.name}
                            >
                              <Draggable.Item resource={e} />
                            </Draggable.Root>
                          ))}
                      </LeftPanel.Section>
                      <LeftPanel.Section title="Others' Destinations">
                        {destinationsWithWatchState
                          .filter((e) => e.visibility === "VISIBILITY_PUBLIC")
                          .map((e) => (
                            <Draggable.Root
                              isPreset={false}
                              key={e.name}
                              id={e.name}
                            >
                              <Draggable.Item resource={e} />
                            </Draggable.Root>
                          ))}
                      </LeftPanel.Section>
                      <LeftPanel.Section title="Popular Presets">
                        {destinationDefinitions.isSuccess
                          ? getConnectorPresets(
                              "CONNECTOR_TYPE_DESTINATION",
                              destinationDefinitions.data
                            ).map((e) => (
                              <Draggable.Root
                                isPreset={true}
                                key={`${e.name}-preset`}
                                id={`${e.name}-preset`}
                              >
                                <Draggable.Item resource={e} />
                              </Draggable.Root>
                            ))
                          : null}
                      </LeftPanel.Section>
                    </>
                  ) : null}
                  {selectedTab === "CONNECTOR_TYPE_BLOCKCHAIN" ? (
                    <>
                      <LeftPanel.Section title="My Blockchains">
                        {blockchainsWithWatchState
                          .filter(
                            (e) =>
                              e.visibility === "VISIBILITY_PRIVATE" ||
                              e.visibility === "VISIBILITY_UNSPECIFIED"
                          )
                          .map((e) => (
                            <Draggable.Root
                              isPreset={false}
                              key={e.name}
                              id={e.name}
                            >
                              <Draggable.Item resource={e} />
                            </Draggable.Root>
                          ))}
                      </LeftPanel.Section>
                      <LeftPanel.Section title="Others' Blockchains">
                        {blockchainsWithWatchState
                          .filter((e) => e.visibility === "VISIBILITY_PUBLIC")
                          .map((e) => (
                            <Draggable.Root
                              isPreset={false}
                              key={e.name}
                              id={e.name}
                            >
                              <Draggable.Item resource={e} />
                            </Draggable.Root>
                          ))}
                      </LeftPanel.Section>
                      <LeftPanel.Section title="Popular Presets">
                        {blockchainDefinitions.isSuccess
                          ? getConnectorPresets(
                              "CONNECTOR_TYPE_BLOCKCHAIN",
                              blockchainDefinitions.data
                            ).map((e) => (
                              <Draggable.Root
                                isPreset={true}
                                key={`${e.name}-preset`}
                                id={`${e.name}-preset`}
                              >
                                <Draggable.Item resource={e} />
                              </Draggable.Root>
                            ))
                          : null}
                      </LeftPanel.Section>
                    </>
                  ) : null}
                </LeftPanel>
              </div>
              <Flow
                ref={reactFlowWrapper}
                setReactFlowInstance={setReactFlowInstance}
                accessToken={null}
              />
              <div
                className={cn(
                  "flex w-[var(--right-panel-width)] transform flex-col overflow-y-scroll bg-semantic-bg-primary p-6 duration-500",
                  rightPanelIsOpen ? "mr-0" : "-mr-[var(--right-panel-width)]"
                )}
              >
                <RightPanel accessToken={null} />
              </div>
            </div>
          </DndContext>
        </PageBase.Container>
      </PageBase>
    </>
  );
};

export default PipelineBuilderPage;
