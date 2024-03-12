"use client";

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
import { NodeData } from "../type";
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
  IteratorNode,
  OperatorNode,
  StartOperatorNode,
} from "./nodes";
import { CustomEdge } from "./CustomEdge";

const selector = (store: InstillStore) => ({
  updateCurrentVersion: store.updateCurrentVersion,
  pipelineIsReadOnly: store.pipelineIsReadOnly,
  updatePipelineIsReadOnly: store.updatePipelineIsReadOnly,
});

const nodeTypes = {
  startNode: StartOperatorNode,
  connectorNode: ConnectorNode,
  emptyNode: EmptyNode,
  endNode: EndOperatorNode,
  operatorNode: OperatorNode,
  iteratorNode: IteratorNode,
};

const edgeTypes = {
  customEdge: CustomEdge,
};

export type ReadOnlyPipelineBuilderProps = {
  pipelineName: Nullable<string>;
  recipe: Nullable<PipelineRecipe>;
  metadata: Nullable<GeneralRecord>;
  className?: string;
};

export const ReadOnlyPipelineBuilder = ({
  pipelineName,
  className,
  recipe,
  metadata,
}: ReadOnlyPipelineBuilderProps) => {
  const router = useRouter();
  const [nodes, setNodes] = React.useState<Node<NodeData>[]>([]);
  const [edges, setEdges] = React.useState<Edge[]>([]);
  const [reactFlowInstance, setReactFlowInstance] =
    React.useState<Nullable<ReactFlowInstance>>(null);

  const { updateCurrentVersion, pipelineIsReadOnly, updatePipelineIsReadOnly } =
    useInstillStore(useShallow(selector));

  React.useEffect(() => {
    if (!recipe || !metadata) return;

    if (checkIsValidPosition(recipe.components, metadata)) {
      const initialGraphData = createInitialGraphData(recipe.components, {
        metadata,
      });

      setNodes(initialGraphData.nodes);
      setEdges(initialGraphData.edges);
      updateCurrentVersion(() => "latest");
      updatePipelineIsReadOnly(() => true);
      return;
    }

    const initialGraphData = createInitialGraphData(recipe.components);

    createGraphLayout(initialGraphData.nodes, initialGraphData.edges)
      .then((graphData) => {
        setNodes(graphData.nodes);
        setEdges(graphData.edges);
        updateCurrentVersion(() => "latest");
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
