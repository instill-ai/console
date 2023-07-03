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
import { DestinationNode, ModelNode, SourceNode } from "../nodes";
import { CustomEdge } from "../CustomEdge";
import { FlowControl } from "./FlowControl";

const pipelineBuilderSelector = (state: PipelineBuilderStore) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  setRightPanelIsOpen: state.setRightPanelIsOpen,
  setSelectedNode: state.setSelectedNode,
});

export type FlowProps = {
  setReactFlowInstance: Dispatch<SetStateAction<Nullable<ReactFlowInstance>>>;
};

const nodeTypes = {
  sourceNode: SourceNode,
  modelNode: ModelNode,
  destinationNode: DestinationNode,
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
  } = usePipelineBuilderStore(pipelineBuilderSelector, shallow);

  const isValidConnection: IsValidConnection = useCallback(
    (connection) => {
      const targetNode = nodes.find((node) => node.id === connection.target);
      const sourceNode = nodes.find((node) => node.id === connection.source);

      if (!targetNode || !sourceNode) {
        return false;
      }

      if (sourceNode.type === "sourceNode" && targetNode.type === "modelNode") {
        return true;
      }

      if (
        sourceNode.type === "modelNode" &&
        targetNode.type === "destinationNode"
      ) {
        return true;
      }

      return false;
    },
    [nodes]
  );

  return (
    <div className="relative flex-1">
      <button
        onClick={() => setRightPanelIsOpen((prev) => !prev)}
        className="absolute right-4 top-4 z-30 h-8 w-8 bg-semantic-accent-bg"
      />
      <div ref={ref} className="h-full w-full flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onInit={setReactFlowInstance}
          onConnect={onConnect}
          fitView
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          proOptions={{ hideAttribution: true }}
          isValidConnection={isValidConnection}
          selectNodesOnDrag={false}
          onNodeClick={(event, node) => {
            setSelectedNode(node);
          }}
          onPaneClick={() => {
            setSelectedNode(null);
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
      <FlowControl />
    </div>
  );
});

Flow.displayName = "Flow";
