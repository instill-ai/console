import { Nullable } from "@instill-ai/toolkit";
import { Dispatch, SetStateAction, forwardRef, useCallback } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  IsValidConnection,
  ReactFlow,
  ReactFlowInstance,
} from "reactflow";
import { shallow } from "zustand/shallow";

import { PipelineBuilderStore, usePipelineBuilderStore } from "@/stores";
import { DestinationNode, AINode, SourceNode, BlockchainNode } from "../nodes";
import { CustomEdge } from "../CustomEdge";
import { FlowControl } from "./FlowControl";
import { useDroppable } from "@dnd-kit/core";
import { DROPPABLE_AREA_ID } from "@/pages/pipelines/[id]";
import { useToast } from "@instill-ai/design-system";

const pipelineBuilderSelector = (state: PipelineBuilderStore) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  setRightPanelIsOpen: state.setRightPanelIsOpen,
  setSelectedNode: state.setSelectedNode,
  selectedNode: state.selectedNode,
  resourceFormIsDirty: state.resourceFormIsDirty,
});

export type FlowProps = {
  setReactFlowInstance: Dispatch<SetStateAction<Nullable<ReactFlowInstance>>>;
};

const nodeTypes = {
  sourceNode: SourceNode,
  aiNode: AINode,
  destinationNode: DestinationNode,
  blockchainNode: BlockchainNode,
};

const edgeTypes = {
  customEdge: CustomEdge,
};

export const Flow = forwardRef<HTMLDivElement, FlowProps>((props, ref) => {
  const { setReactFlowInstance } = props;
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setRightPanelIsOpen,
    setSelectedNode,
    selectedNode,
    resourceFormIsDirty,
  } = usePipelineBuilderStore(pipelineBuilderSelector, shallow);

  const { setNodeRef } = useDroppable({
    id: DROPPABLE_AREA_ID,
  });

  const isValidConnection: IsValidConnection = useCallback(
    (connection) => {
      const targetNode = nodes.find((node) => node.id === connection.target);
      const sourceNode = nodes.find((node) => node.id === connection.source);

      if (!targetNode || !sourceNode) {
        return false;
      }

      if (sourceNode.type === "sourceNode" && targetNode.type === "aiNode") {
        return true;
      }

      if (
        sourceNode.type === "aiNode" &&
        targetNode.type === "blockchainNode"
      ) {
        return true;
      }

      if (
        sourceNode.type === "blockchainNode" &&
        targetNode.type === "destinationNode"
      ) {
        return true;
      }

      return false;
    },
    [nodes]
  );

  const { toast } = useToast();

  return (
    <div className="relative flex-1">
      <button
        onClick={() => setRightPanelIsOpen((prev) => !prev)}
        className="absolute right-4 top-4 z-30 h-8 w-8 bg-semantic-accent-bg"
      />
      <div ref={setNodeRef} className="h-full w-full flex-1">
        <div ref={ref} className="h-full w-full flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesDelete={(nodes) => {
              if (nodes.some((node) => node.id === selectedNode?.id)) {
                setSelectedNode(null);
              }
            }}
            onNodesChange={(event) => {
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

              onNodesChange(event);
            }}
            onEdgesChange={(event) => {
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

              onEdgesChange(event);
            }}
            onInit={setReactFlowInstance}
            onConnect={onConnect}
            fitView
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            proOptions={{ hideAttribution: true }}
            isValidConnection={isValidConnection}
            selectNodesOnDrag={false}
            onNodeClick={(event, node) => {
              if (resourceFormIsDirty) {
                toast({
                  title: "You have unsaved changes",
                  description:
                    "Please save or discard your changes before editing another resource.",
                  size: "large",
                  variant: "alert-warning",
                });
              } else {
                setSelectedNode(node);
                setRightPanelIsOpen((prev) => {
                  if (!prev) {
                    return true;
                  } else {
                    return prev;
                  }
                });
              }
            }}
            onPaneClick={() => {
              if (resourceFormIsDirty) {
                toast({
                  title: "You have unsaved changes",
                  description:
                    "Please save or discard your changes before editing another resource.",
                  size: "large",
                  variant: "alert-warning",
                });
              } else {
                setSelectedNode(null);
              }
            }}

            // We disable the selection triggered by react-flow due to
            // it will redundantly trigger another time when selectNodesOnDrag
            // is set to false.
            // https://github.com/wbkd/react-flow/issues/1876
            // onSelectionChange={(params) => {
            //   setSelectedNode(params.nodes[0]);
            // }}
          >
            <Controls />
            <Background
              variant={BackgroundVariant.Dots}
              gap={16}
              color="#d1d5db"
            />
          </ReactFlow>
        </div>
      </div>
      <FlowControl />
    </div>
  );
});

Flow.displayName = "Flow";
