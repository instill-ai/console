import cn from "clsx";
import { FC, ReactElement, useEffect, useMemo, useRef, useState } from "react";
import {
  Nullable,
  useConnectorResources,
  useWatchConnectorResources,
  ConnectorResourceWithWatchState,
  useWatchPipeline,
} from "@instill-ai/toolkit";
import { shallow } from "zustand/shallow";
import { Edge, Node, ReactFlowInstance } from "reactflow";
import { v4 as uuidv4 } from "uuid";

type GetLayOutProps = {
  page: ReactElement;
};

import { PageBase, PageHead, Topbar } from "@/components";
import { useRouter } from "next/router";
import { RightPanel } from "pipeline-builder/RightPanel";
import { Flow } from "pipeline-builder/Flow";
import {
  PipelineBuilderStore,
  usePipelineBuilderStore,
} from "pipeline-builder/usePipelineBuilderStore";
import { createGraphLayout } from "pipeline-builder/createGraphLayout";
import { createInitialGraphData } from "pipeline-builder/createInitialGraphData";
import { NodeData } from "pipeline-builder/type";
import { usePipeline } from "pipeline-builder/sdk";
import { PipelineNameForm } from "pipeline-builder/PipelineNameForm";

const pipelineBuilderSelector = (state: PipelineBuilderStore) => ({
  setPipelineId: state.setPipelineId,
  setPipelineUid: state.setPipelineUid,
  setPipelineDescription: state.setPipelineDescription,
  rightPanelIsOpen: state.rightPanelIsOpen,
  updateNodes: state.updateNodes,
  updateEdges: state.updateEdges,
  connectorFormIsDirty: state.connectorFormIsDirty,
  updatePipelineRecipeIsDirty: state.updatePipelineRecipeIsDirty,
  pipelineIsNew: state.pipelineIsNew,
});

export const DROPPABLE_AREA_ID = "pipeline-builder-droppable";

const PipelineBuilderPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const {
    setPipelineId,
    setPipelineUid,
    setPipelineDescription,
    rightPanelIsOpen,
    updateNodes,
    updateEdges,
    pipelineIsNew,
  } = usePipelineBuilderStore(pipelineBuilderSelector, shallow);

  const router = useRouter();
  const { id } = router.query;

  // We need to warn user of unsave changes when they try to leave the page

  // We initialize the pipeline with default start, end operator and a empty node.

  useEffect(() => {
    if (!pipelineIsNew) return;

    const initialEmptyNodeId = uuidv4();

    console.log(initialEmptyNodeId);

    const nodes: Node<NodeData>[] = [
      {
        id: "start",
        type: "startNode",
        data: {
          nodeType: "start",
          component: {
            id: "start",
            type: "COMPONENT_TYPE_OPERATOR",
            configuration: { body: {} },
            resource_name: "",
            resource_detail: null,
            definition_name: "operator-definitions/start-operator",
            definition_detail: {},
          },
        },
        position: { x: 0, y: 0 },
      },
      {
        id: initialEmptyNodeId,
        type: "emptyNode",
        data: {
          nodeType: "empty",
          component: null,
        },
        position: { x: 0, y: 0 },
      },
      {
        id: "end",
        type: "endNode",
        data: {
          nodeType: "end",
          component: {
            id: "end",
            type: "COMPONENT_TYPE_OPERATOR",
            configuration: {
              body: {},
            },
            resource_name: "",
            resource_detail: null,
            definition_name: "operator-definitions/end-operator",
            definition_detail: {},
          },
        },
        position: { x: 0, y: 0 },
      },
    ];

    const edges: Edge[] = [
      {
        id: "start-empty",
        type: "customEdge",
        source: "start",
        target: initialEmptyNodeId,
      },
      {
        id: "empty-end",
        type: "customEdge",
        source: initialEmptyNodeId,
        target: "end",
      },
    ];

    createGraphLayout(nodes, edges)
      .then((graphData) => {
        updateNodes(() => graphData.nodes);
        updateEdges(() => graphData.edges);
        setGraphIsInitialized(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [pipelineIsNew, updateEdges, updateNodes]);

  const pipeline = usePipeline({
    enabled: !!id && !pipelineIsNew,
    pipelineName: id ? `pipelines/${id}` : null,
    accessToken: null,
    retry: false,
  });

  const pipelineWatchState = useWatchPipeline({
    pipelineName: id ? `pipelines/${id}` : null,
    enabled: !!id && !pipelineIsNew && pipeline.isSuccess,
    accessToken: null,
  });

  const isLoadingPipelineWithWatchState = useMemo(() => {
    return pipeline.isLoading || pipelineWatchState.isLoading;
  }, [pipeline.isLoading, pipelineWatchState.isLoading]);

  const [, setReactFlowInstance] = useState<Nullable<ReactFlowInstance>>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const sources = useConnectorResources({
    connectorResourceType: "CONNECTOR_TYPE_OPERATOR",
    accessToken: null,
    enabled: true,
  });

  const sourcesWatchState = useWatchConnectorResources({
    connectorResourceType: "CONNECTOR_TYPE_OPERATOR",
    connectorResourceNames: sources.isSuccess
      ? sources.data.map((source) => source.name)
      : [],
    accessToken: null,
    enabled: sources.isSuccess && sources.data.length > 0,
  });

  const sourcesWithWatchState = useMemo<
    ConnectorResourceWithWatchState[]
  >(() => {
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

  const isLoadingSourcesWithState = useMemo(() => {
    if (sources.isSuccess && sources.data.length === 0) return false;
    return sources.isLoading || sourcesWatchState.isLoading;
  }, [
    sources.isLoading,
    sourcesWatchState.isLoading,
    sources.isSuccess,
    sources.data,
  ]);

  const destinations = useConnectorResources({
    connectorResourceType: "CONNECTOR_TYPE_DATA",
    accessToken: null,
    enabled: true,
  });

  const destinationsWatchState = useWatchConnectorResources({
    connectorResourceType: "CONNECTOR_TYPE_DATA",
    connectorResourceNames: destinations.isSuccess
      ? destinations.data.map((destination) => destination.name)
      : [],
    accessToken: null,
    enabled: destinations.isSuccess && destinations.data.length > 0,
  });

  const destinationsWithWatchState = useMemo<
    ConnectorResourceWithWatchState[]
  >(() => {
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

  const isLoadingDestinationsWithState = useMemo(() => {
    if (destinations.isSuccess && destinations.data.length === 0) return false;
    return destinations.isLoading || destinationsWatchState.isLoading;
  }, [
    destinations.isLoading,
    destinationsWatchState.isLoading,
    destinations.isSuccess,
    destinations.data,
  ]);

  const ais = useConnectorResources({
    connectorResourceType: "CONNECTOR_TYPE_AI",
    accessToken: null,
    enabled: true,
  });

  const aisWatchState = useWatchConnectorResources({
    connectorResourceType: "CONNECTOR_TYPE_AI",
    connectorResourceNames: ais.isSuccess ? ais.data.map((ai) => ai.name) : [],
    accessToken: null,
    enabled: ais.isSuccess && ais.data.length > 0,
  });

  const aisWithWatchState = useMemo<ConnectorResourceWithWatchState[]>(() => {
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

  const isLoadingAIsWithState = useMemo(() => {
    if (ais.isSuccess && ais.data.length === 0) return false;
    return ais.isLoading || aisWatchState.isLoading;
  }, [ais.isLoading, aisWatchState.isLoading, ais.isSuccess, ais.data]);

  const blockchains = useConnectorResources({
    connectorResourceType: "CONNECTOR_TYPE_BLOCKCHAIN",
    accessToken: null,
    enabled: true,
  });

  const blockchainsWatchState = useWatchConnectorResources({
    connectorResourceType: "CONNECTOR_TYPE_BLOCKCHAIN",
    connectorResourceNames: blockchains.isSuccess
      ? blockchains.data.map((ai) => ai.name)
      : [],
    accessToken: null,
    enabled: blockchains.isSuccess && blockchains.data.length > 0,
  });

  const blockchainsWithWatchState = useMemo<
    ConnectorResourceWithWatchState[]
  >(() => {
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

  const isLoadingBlockchainsWithState = useMemo(() => {
    if (blockchains.isSuccess && blockchains.data.length === 0) return false;
    return blockchains.isLoading || blockchainsWatchState.isLoading;
  }, [
    blockchains.isLoading,
    blockchainsWatchState.isLoading,
    blockchains.isSuccess,
    blockchains.data,
  ]);

  /* -------------------------------------------------------------------------
   * Initialize pipeline id
   * -----------------------------------------------------------------------*/

  useEffect(() => {
    if (!pipeline.isSuccess) {
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
      !pipelineWatchState.isSuccess ||
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
      pipeline: {
        ...pipeline.data,
        recipe: {
          ...pipeline.data.recipe,
        },
        watchState: pipelineWatchState.data.state,
      },
    });

    createGraphLayout(initialData.nodes, initialData.edges)
      .then((graphData) => {
        updateNodes(() => graphData.nodes);
        updateEdges(() => graphData.edges);
        setGraphIsInitialized(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [
    pipeline.isSuccess,
    setPipelineId,
    setPipelineUid,
    graphIsInitialized,
    pipeline.data,
    updateEdges,
    updateNodes,
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
    pipelineWatchState.data?.state,
    pipelineWatchState.isSuccess,
  ]);

  const isLoadingGraphFirstPaint = useMemo(() => {
    console.log(pipelineIsNew);
    if (pipelineIsNew) return false;

    if (
      isLoadingPipelineWithWatchState ||
      isLoadingAIsWithState ||
      isLoadingBlockchainsWithState ||
      isLoadingDestinationsWithState ||
      isLoadingSourcesWithState
    ) {
      return true;
    }

    return false;
  }, [
    pipelineIsNew,
    isLoadingPipelineWithWatchState,
    isLoadingAIsWithState,
    isLoadingBlockchainsWithState,
    isLoadingDestinationsWithState,
    isLoadingSourcesWithState,
  ]);

  /* -------------------------------------------------------------------------
   * Update the nodes and edges with up-to-date state
   * -----------------------------------------------------------------------*/

  // useEffect(() => {
  //   updateNodes((prev) => {
  //     const newNodes = [];

  //     for (const node of prev) {
  //       if (
  //         node.data.nodeType === "start" ||
  //         node.data.nodeType === "end" ||
  //         node.data.nodeType === "empty"
  //       ) {
  //         newNodes.push(node);
  //         continue;
  //       }

  //       if (node.data.connector.connector_type === "CONNECTOR_TYPE_AI") {
  //         const targetAIName = node.data.connector.name;
  //         const ai = aisWithWatchState.find((ai) => ai.name === targetAIName);
  //         if (ai) {
  //           const newAINode = node;
  //           newAINode.data = {
  //             nodeType: "connector",
  //             connector: ai,
  //           };
  //           newNodes.push(newAINode);
  //         }
  //         continue;
  //       }

  //       if (
  //         node.data.connector.connector_type === "CONNECTOR_TYPE_BLOCKCHAIN"
  //       ) {
  //         const targetBlockchainName = node.data.connector.name;
  //         const blockchain = blockchainsWithWatchState.find(
  //           (ai) => ai.name === targetBlockchainName
  //         );
  //         if (blockchain) {
  //           const newBlockchainNode = node;
  //           newBlockchainNode.data = {
  //             nodeType: "connector",
  //             connector: blockchain,
  //           };
  //           newNodes.push(newBlockchainNode);
  //         }
  //         continue;
  //       }
  //     }

  //     return newNodes;
  //   });
  // }, [
  //   aisWithWatchState,
  //   sourcesWithWatchState,
  //   destinationsWithWatchState,
  //   blockchainsWithWatchState,
  //   updateNodes,
  // ]);

  return (
    <>
      <PageBase>
        <Topbar>
          <div className="flex px-3 py-2">
            <PipelineNameForm accessToken={null} enableQuery={true} />
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
          <div className="pipeline-builder flex h-[calc(100vh-var(--topbar-height))] w-full flex-row overflow-x-hidden bg-semantic-bg-base-bg">
            <Flow
              ref={reactFlowWrapper}
              setReactFlowInstance={setReactFlowInstance}
              accessToken={null}
              enableQuery={true}
              isLoading={isLoadingGraphFirstPaint}
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
        </PageBase.Container>
      </PageBase>
    </>
  );
};

export default PipelineBuilderPage;
