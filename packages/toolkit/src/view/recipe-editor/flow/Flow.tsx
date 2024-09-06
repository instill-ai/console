"use client";

import * as React from "react";
import { PipelineRecipe } from "instill-sdk";
import ReactFlow, {
  Background,
  BackgroundVariant,
  SelectionMode,
  useEdgesState,
  useNodesState,
} from "reactflow";

import { Icons } from "@instill-ai/design-system";

import {
  GeneralRecord,
  InstillStore,
  Nullable,
  useInstillStore,
  useShallow,
} from "../../../lib";
import {
  composeEdgesFromNodes,
  createGraphLayout,
  CustomEdge,
} from "../../pipeline-builder";
import { canvasPanOnDrag } from "../../pipeline-builder/components/canvasPanOnDrag";
import { createNodesFromPipelineRecipe } from "../../pipeline-builder/lib/createNodesFromPipelineRecipe";
import { EditorButtonTooltipWrapper } from "../EditorButtonTooltipWrapper";
import { GeneralNode, IteratorNode, ResponseNode, VariableNode } from "./nodes";

const nodeTypes = {
  generalNode: GeneralNode,
  iteratorNode: IteratorNode,
  variableNode: VariableNode,
  responseNode: ResponseNode,
};

const edgeTypes = {
  customEdge: CustomEdge,
};

const selector = (store: InstillStore) => ({
  updateSelectedComponentId: store.updateSelectedComponentId,
  editorPreviewReactFlowInstance: store.editorPreviewReactFlowInstance,
  updateEditorPreviewReactFlowInstance:
    store.updateEditorPreviewReactFlowInstance,
});

export const fitViewOptions = {
  includeHiddenNodes: true,
  padding: 10,
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

  const {
    updateSelectedComponentId,
    editorPreviewReactFlowInstance,
    updateEditorPreviewReactFlowInstance,
  } = useInstillStore(useShallow(selector));

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
  }, [
    recipe,
    pipelineMetadata,
    setEdges,
    setNodes,
    editorPreviewReactFlowInstance,
  ]);

  return (
    <div className="flex flex-col w-full h-full group">
      <div className="flex flex-row h-9 justify-between items-center bg-semantic-bg-alt-primary border-b border-semantic-bg-line">
        <EditorButtonTooltipWrapper tooltipContent="Fit view">
          <button
            onClick={() => {
              if (!editorPreviewReactFlowInstance) {
                return;
              }

              editorPreviewReactFlowInstance.fitView(fitViewOptions);
            }}
            className="p-1.5"
          >
            <Icons.Maximize02 className="w-3 h-3 stroke-semantic-fg-primary" />
          </button>
        </EditorButtonTooltipWrapper>
        <div className="flex flex-row">
          <EditorButtonTooltipWrapper tooltipContent="Zoom in">
            <button
              className="p-1.5"
              onClick={() => {
                if (!editorPreviewReactFlowInstance) {
                  return;
                }

                editorPreviewReactFlowInstance.zoomIn();
              }}
            >
              <Icons.Plus className="w-3 h-3 stroke-semantic-fg-primary" />
            </button>
          </EditorButtonTooltipWrapper>
          <EditorButtonTooltipWrapper tooltipContent="Zoom out">
            <button
              className="p-1.5"
              onClick={() => {
                if (!editorPreviewReactFlowInstance) {
                  return;
                }

                editorPreviewReactFlowInstance.zoomOut();
              }}
            >
              <Icons.Minus className="w-3 h-3 stroke-semantic-fg-primary" />
            </button>
          </EditorButtonTooltipWrapper>
        </div>
      </div>
      <ReactFlow
        id={pipelineId ?? undefined}
        className="w-full h-full rounded-b"
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        fitView={true}
        minZoom={0.5}
        fitViewOptions={fitViewOptions}
        onPaneClick={() => {
          updateSelectedComponentId(() => null);
        }}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onInit={(instance) => {
          updateEditorPreviewReactFlowInstance(() => instance);
        }}
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
      </ReactFlow>
    </div>
  );
};
