"use client";

import * as React from "react";
import { PipelineRecipe } from "instill-sdk";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlowInstance,
  SelectionMode,
  useEdgesState,
  useNodesState,
} from "reactflow";

import { GeneralRecord, Nullable } from "../../../lib";
import {
  composeEdgesFromNodes,
  createGraphLayout,
  CustomEdge,
} from "../../pipeline-builder";
import { canvasPanOnDrag } from "../../pipeline-builder/components/canvasPanOnDrag";
import { createNodesFromPipelineRecipe } from "../../pipeline-builder/lib/createNodesFromPipelineRecipe";
import { GeneralNode } from "./nodes/GeneralNode";
import { ResponseNode } from "./nodes/ResponseNode";
import { VariableNode } from "./nodes/VariableNode";

const nodeTypes = {
  variableNode: VariableNode,
  responseNode: ResponseNode,
  generalNode: GeneralNode,
};

const edgeTypes = {
  customEdge: CustomEdge,
};

export const Flow = ({
  pipelineId,
  recipe,
  pipelineMetadata,
}: {
  recipe: Nullable<PipelineRecipe>;
  pipelineId: Nullable<string>;
  pipelineMetadata: Nullable<GeneralRecord>;
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] =
    React.useState<Nullable<ReactFlowInstance>>(null);

  React.useEffect(() => {
    if (!recipe || !pipelineMetadata) return;

    const nodes = createNodesFromPipelineRecipe(recipe, {
      metadata: pipelineMetadata,
    });
    const edges = composeEdgesFromNodes(nodes);

    createGraphLayout(nodes, edges)
      .then((graphData) => {
        setNodes(graphData.nodes);
        setEdges(graphData.edges);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [recipe, pipelineMetadata, setEdges, setNodes, reactFlowInstance]);

  return (
    <ReactFlow
      id={pipelineId ?? undefined}
      className="rounded-sm"
      nodes={nodes}
      onNodesChange={onNodesChange}
      edges={edges}
      onEdgesChange={onEdgesChange}
      fitView={true}
      minZoom={0.5}
      fitViewOptions={{
        includeHiddenNodes: true,
        padding: 10,
      }}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
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
        id={pipelineId ?? undefined}
        variant={BackgroundVariant.Dots}
        gap={32}
        color="#D2D6DB"
        className="!bg-semantic-bg-alt-primary"
        size={3}
      />
      <Controls
        id={pipelineId ?? undefined}
        showInteractive={false}
        className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </ReactFlow>
  );
};
