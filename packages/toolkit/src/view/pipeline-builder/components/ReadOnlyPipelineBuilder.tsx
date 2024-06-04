"use client";

import cn from "clsx";
import * as React from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlowInstance,
  SelectionMode,
  useEdgesState,
  useNodesState,
} from "reactflow";

import {
  GeneralRecord,
  InstillStore,
  Nullable,
  PipelineRecipe,
  useInstillStore,
  useShallow,
} from "../../../lib";
import { composeEdgesFromNodes, createGraphLayout } from "../lib";
import {
  EmptyNode,
  GeneralNode,
  IteratorNode,
  ResponseNode,
  VariableNode,
} from "./nodes";
import { CustomEdge } from "./CustomEdge";
import { createNodesFromPipelineRecipe } from "../lib/createNodesFromPipelineRecipe";
import { canvasPanOnDrag } from "./canvasPanOnDrag";

const selector = (store: InstillStore) => ({
  updateCurrentVersion: store.updateCurrentVersion,
  pipelineIsReadOnly: store.pipelineIsReadOnly,
  updatePipelineIsReadOnly: store.updatePipelineIsReadOnly,
  updateCollapseAllNodes: store.updateCollapseAllNodes,
});

const nodeTypes = {
  variableNode: VariableNode,
  emptyNode: EmptyNode,
  responseNode: ResponseNode,
  iteratorNode: IteratorNode,
  generalNode: GeneralNode,
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
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] =
    React.useState<Nullable<ReactFlowInstance>>(null);

  const {
    updateCurrentVersion,
    updatePipelineIsReadOnly,
    updateCollapseAllNodes,
  } = useInstillStore(useShallow(selector));

  React.useEffect(() => {
    if (!recipe || !metadata) return;
    const nodes = createNodesFromPipelineRecipe(recipe, { metadata });
    const edges = composeEdgesFromNodes(nodes);

    createGraphLayout(nodes, edges)
      .then((graphData) => {
        setNodes(graphData.nodes);
        setEdges(graphData.edges);
        updateCurrentVersion(() => "latest");
        updatePipelineIsReadOnly(() => true);
        updateCollapseAllNodes(() => true);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [
    recipe,
    metadata,
    setEdges,
    setNodes,
    reactFlowInstance,
    updateCurrentVersion,
    updatePipelineIsReadOnly,
    updateCollapseAllNodes,
  ]);

  // Clean up the pipelineIsReadOnly state when user navigate away
  // from the page
  React.useEffect(() => {
    updatePipelineIsReadOnly(() => true);
    return () => {
      updatePipelineIsReadOnly(() => false);
    };
  }, [updatePipelineIsReadOnly]);

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
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        fitView={true}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        minZoom={0.35}
        fitViewOptions={{
          includeHiddenNodes: true,
          padding: 10,
        }}
        onInit={setReactFlowInstance}
        proOptions={{ hideAttribution: true }}
        elevateNodesOnSelect={true}
        // To enable Figma-like zoom-in-out experience
        panOnScroll={false}
        panOnDrag={canvasPanOnDrag}
        selectionMode={SelectionMode.Partial}
        selectionOnDrag={true}
        nodeOrigin={[0.5, 0.5]}
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
