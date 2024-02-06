import cn from "clsx";
import * as React from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  Node,
  ReactFlowInstance,
} from "reactflow";

import {
  GeneralRecord,
  InstillStore,
  Nullable,
  PipelineRecipe,
  useInstillStore,
  useNavigationObserver,
  useShallow,
} from "../../../lib";

import {
  checkIsValidPosition,
  createGraphLayout,
  createInitialGraphData,
} from "../lib";
import { useRouter } from "next/router";
import {
  ConnectorNode,
  EmptyNode,
  EndOperatorNode,
  OperatorNode,
  StartOperatorNode,
} from "./nodes";
import { CustomEdge } from "./CustomEdge";

const selector = (store: InstillStore) => ({
  nodes: store.nodes,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
  updateCurrentVersion: store.updateCurrentVersion,
  pipelineIsReadOnly: store.pipelineIsReadOnly,
  updatePipelineIsReadOnly: store.updatePipelineIsReadOnly,
  currentVersion: store.currentVersion,
});

const nodeTypes = {
  startNode: StartOperatorNode,
  connectorNode: ConnectorNode,
  emptyNode: EmptyNode,
  endNode: EndOperatorNode,
  operatorNode: OperatorNode,
};

const edgeTypes = {
  customEdge: CustomEdge,
};

export type ReadOnlyPipelineBuilderWithVersionProps = {
  pipelineName: Nullable<string>;
  recipe: Nullable<PipelineRecipe>;
  metadata: Nullable<GeneralRecord>;
  className?: string;
};

export const ReadOnlyPipelineBuilderWithVersion = ({
  pipelineName,
  className,
  recipe,
  metadata,
}: ReadOnlyPipelineBuilderWithVersionProps) => {
  const router = useRouter();

  const [edges, setEdges] = React.useState<Edge[]>([]);
  const [reactFlowInstance, setReactFlowInstance] =
    React.useState<Nullable<ReactFlowInstance>>(null);

  const {
    nodes,
    updateNodes,
    updateEdges,
    updateCurrentVersion,
    pipelineIsReadOnly,
    updatePipelineIsReadOnly,
    currentVersion,
  } = useInstillStore(useShallow(selector));

  React.useEffect(() => {
    if (!recipe || !metadata) return;

    if (checkIsValidPosition(recipe, metadata)) {
      const initialGraphData = createInitialGraphData(recipe, {
        metadata,
      });

      updateNodes(() => initialGraphData.nodes);
      updateEdges(() => initialGraphData.edges);
      updateCurrentVersion(() => currentVersion || "latest");
      updatePipelineIsReadOnly(() => true);
      return;
    }

    const initialGraphData = createInitialGraphData(recipe);

    createGraphLayout(initialGraphData.nodes, initialGraphData.edges)
      .then((graphData) => {
        updateNodes(() => graphData.nodes);
        updateEdges(() => graphData.edges);
        updateCurrentVersion(() => currentVersion || "latest");
        updatePipelineIsReadOnly(() => true);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [
    recipe,
    metadata,
    reactFlowInstance,
    updateCurrentVersion,
    updatePipelineIsReadOnly,
    currentVersion,
  ]);

  // Clean up the pipelineIsReadOnly state when user navigate away
  // from the page
  useNavigationObserver({
    shouldStopNavigation: false,
    onNavigate: () => {
      updatePipelineIsReadOnly(() => false);
    },
    router,
  });

  return (
    <div
      className={cn(
        "group flex w-full rounded-sm border-2 border-semantic-bg-line",
        className
      )}
    >
      <ReactFlow
        id={pipelineName ?? undefined}
        className="rounded-sm"
        nodes={nodes}
        edges={edges}
        fitView={true}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        minZoom={0.2}
        fitViewOptions={{
          includeHiddenNodes: true,
          padding: 20,
        }}
        onInit={setReactFlowInstance}
        proOptions={{ hideAttribution: true }}
        selectNodesOnDrag={pipelineIsReadOnly}
        nodesDraggable={pipelineIsReadOnly}
        nodesConnectable={pipelineIsReadOnly}
        elementsSelectable={pipelineIsReadOnly}
        connectOnClick={pipelineIsReadOnly}
      >
        <Background
          id={pipelineName ?? undefined}
          variant={BackgroundVariant.Dots}
          gap={32}
          color="#D2D6DB"
          className="!bg-semantic-bg-alt-primary"
          size={3}
        />
        <Controls
          id={pipelineName ?? undefined}
          showInteractive={false}
          className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </ReactFlow>
    </div>
  );
};
