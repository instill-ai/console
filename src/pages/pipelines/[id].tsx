import cn from "clsx";
import { FC, ReactElement, useEffect, useMemo, useRef, useState } from "react";
import {
  Icons,
  getModelInstanceTaskToolkit,
  useToast,
} from "@instill-ai/design-system";
import {
  ConnectorType,
  ImageWithFallback,
  Nullable,
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
  useDraggable,
} from "@dnd-kit/core";

type GetLayOutProps = {
  page: ReactElement;
};

import { ConnectorWithWatchState, ConnectorNodeData } from "@/types";
import { PipelineBuilderStore, usePipelineBuilderStore } from "@/stores";
import {
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

    setPipelineUid(pipeline.data.uid);
    setPipelineId(pipeline.data.id);

    const initialData = createInitialGraphData({
      pipeline: pipeline.data,
      ais: aisWithWatchState,
      sources: sourcesWithWatchState,
      destinations: destinationsWithWatchState,
      blockchains: blockchainsWithWatchState,
    });

    createGraphLayout(initialData.nodes, initialData.edges).then(
      (graphData) => {
        setNodes(graphData.nodes);
        setEdges(graphData.edges);
      }
    );

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

    let allConnectors: ConnectorWithWatchState[] = [];

    allConnectors = [
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
    useState<Nullable<ConnectorWithWatchState>>(null);

  const dropOverlayRef = useRef<HTMLDivElement>(null);

  function handleDragStart({ active }: DragStartEvent) {
    let allConnectors: ConnectorWithWatchState[] = [];

    allConnectors = [
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

    if (event.over?.id !== "pipeline-builder-droppable") {
      return;
    }

    const overlayPosition = dropOverlayRef.current.getBoundingClientRect();
    const reactFlowPosition = reactFlowWrapper.current.getBoundingClientRect();

    let newNode: Nullable<Node<ConnectorNodeData>> = null;

    switch (draggedItem.connector_type) {
      case "CONNECTOR_TYPE_AI": {
        newNode = {
          id: uuidv4(),
          type: "aiNode",
          sourcePosition: Position.Left,
          targetPosition: Position.Right,
          data: {
            connectorType: "CONNECTOR_TYPE_AI",
            connector: draggedItem,
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
            connector: draggedItem,
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
            connector: draggedItem,
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
            connector: draggedItem,
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
                {draggedItem ? <Item resource={draggedItem} /> : null}
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
                  {selectedTab === "CONNECTOR_TYPE_SOURCE"
                    ? sourcesWithWatchState.map((e) => (
                        <Draggable key={e.name} id={e.name}>
                          <Item resource={e} />
                        </Draggable>
                      ))
                    : null}
                  {selectedTab === "CONNECTOR_TYPE_AI"
                    ? aisWithWatchState.map((ai) => (
                        <Draggable key={ai.name} id={ai.name}>
                          <Item resource={ai} />
                        </Draggable>
                      ))
                    : null}
                  {selectedTab === "CONNECTOR_TYPE_DESTINATION"
                    ? destinationsWithWatchState.map((e) => (
                        <Draggable key={e.name} id={e.name}>
                          <Item resource={e} />
                        </Draggable>
                      ))
                    : null}
                  {selectedTab === "CONNECTOR_TYPE_BLOCKCHAIN"
                    ? blockchainsWithWatchState.map((e) => (
                        <Draggable key={e.name} id={e.name}>
                          <Item resource={e} />
                        </Draggable>
                      ))
                    : null}
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

const Draggable = (props: { id: string; children: ReactElement }) => {
  const { id, children } = props;
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id,
  });

  return (
    <div
      className={isDragging ? "opacity-40" : ""}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
};

const Item = (props: { resource: ConnectorWithWatchState }) => {
  const { resource } = props;

  let fallbackImg: Nullable<ReactElement> = null;

  switch (resource.connector_type) {
    case "CONNECTOR_TYPE_AI":
      fallbackImg = (
        <Icons.Model className="h-4 w-4 stroke-semantic-fg-primary" />
      );
      break;
    case "CONNECTOR_TYPE_BLOCKCHAIN":
      fallbackImg = (
        <Icons.CubeOutline className="h-4 w-4 stroke-semantic-fg-primary" />
      );
      break;
    case "CONNECTOR_TYPE_DESTINATION":
      fallbackImg = (
        <Icons.Box className="h-4 w-4 stroke-semantic-fg-primary" />
      );
      break;
    case "CONNECTOR_TYPE_SOURCE":
      fallbackImg = (
        <Icons.Database01 className="h-4 w-4 stroke-semantic-fg-primary" />
      );
      break;

    default:
      break;
  }

  if (resource.connector_type === "CONNECTOR_TYPE_AI") {
    const { label } = getModelInstanceTaskToolkit(resource.task);

    return (
      <div className="flex w-full cursor-grab flex-col space-y-4 rounded border border-semantic-bg-line p-2 hover:bg-semantic-accent-bg">
        <div className="flex h-8 w-full flex-row">
          <div className="flex flex-row">
            <div className="flex h-8 w-8 items-center justify-center">
              <ImageWithFallback
                src={`/icons/${resource.connector_definition.vendor}/${resource.connector_definition.icon}`}
                width={24}
                height={24}
                alt={`${resource.connector_definition.title}-icon`}
                fallbackImg={
                  <Icons.Model className="h-4 w-4 stroke-semantic-fg-primary" />
                }
              />
            </div>
            <h5 className="my-auto w-[160px] truncate text-semantic-fg-primary product-headings-heading-5">
              {resource.name.split("/")[1]}
            </h5>
          </div>
        </div>
        <div className="flex">
          <p className="rounded-full bg-semantic-accent-bg px-2 py-0.5 pl-2 text-semantic-accent-on-bg product-label-label-1">
            {label === "" ? "unspecified" : label}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full cursor-grab rounded border border-semantic-bg-line p-2 hover:bg-semantic-accent-bg">
      <div className="flex h-8 w-full flex-row">
        <div className="flex flex-row">
          <div className="flex h-8 w-8 items-center justify-center">
            <ImageWithFallback
              src={`/icons/${resource.connector_definition.vendor}/${resource.connector_definition.icon}`}
              width={24}
              height={24}
              alt={`${resource.connector_definition.title}-icon`}
              fallbackImg={
                fallbackImg ?? (
                  <Icons.Cube01 className="h-4 w-4 stroke-semantic-fg-primary" />
                )
              }
            />
          </div>
          <h5 className="my-auto w-[160px] truncate text-semantic-fg-primary product-headings-heading-5">
            {resource.name.split("/")[1]}
          </h5>
        </div>
      </div>
    </div>
  );
};

export default PipelineBuilderPage;
