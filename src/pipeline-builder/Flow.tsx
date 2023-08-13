import cn from "clsx";
import { Dispatch, SetStateAction, forwardRef } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  ReactFlowInstance,
} from "reactflow";
import { shallow } from "zustand/shallow";

import { CustomEdge } from "./CustomEdge";
import { FlowControl } from "./FlowControl";
import { Icons } from "@instill-ai/design-system";
import {
  PipelineBuilderStore,
  usePipelineBuilderStore,
} from "./usePipelineBuilderStore";
import { Nullable } from "@instill-ai/toolkit";
import { StartNode } from "./StartNode";
import { ConnectorNode } from "./ConnectorNode";
import { EmptyNode } from "./EmptyNode";
import { EndNode } from "./EndNode";

const pipelineBuilderSelector = (state: PipelineBuilderStore) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  rightPanelIsOpen: state.rightPanelIsOpen,
  updatePipelineRecipeIsDirty: state.updatePipelineRecipeIsDirty,
  updateRightPanelIsOpen: state.updateRightPanelIsOpen,
});

export type FlowProps = {
  setReactFlowInstance: Dispatch<SetStateAction<Nullable<ReactFlowInstance>>>;
  accessToken: Nullable<string>;
  enableQuery: boolean;
  isLoading: boolean;
};

const nodeTypes = {
  startNode: StartNode,
  connectorNode: ConnectorNode,
  emptyNode: EmptyNode,
  endNode: EndNode,
};

const edgeTypes = {
  customEdge: CustomEdge,
};

export const Flow = forwardRef<HTMLDivElement, FlowProps>((props, ref) => {
  const { setReactFlowInstance, accessToken, enableQuery, isLoading } = props;
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    rightPanelIsOpen,
    updatePipelineRecipeIsDirty,
    updateRightPanelIsOpen,
  } = usePipelineBuilderStore(pipelineBuilderSelector, shallow);

  return (
    <div className="relative flex-1">
      <div className="relative h-full w-full flex-1">
        <div ref={ref} className={cn("h-full w-full flex-1")}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesDelete={() => {
              updatePipelineRecipeIsDirty((prev) => {
                if (prev) return prev;
                return true;
              });
            }}
            onEdgesDelete={() => {
              updatePipelineRecipeIsDirty((prev) => {
                if (prev) return prev;
                return true;
              });
            }}
            onNodesChange={(event) => {
              onNodesChange(event);
            }}
            onEdgesChange={(event) => {
              onEdgesChange(event);
            }}
            onInit={setReactFlowInstance}
            onConnect={(e) => {
              // When the user set up new connecton, we will update the pipeline recipe
              // dirtiness.
              onConnect(e);
              updatePipelineRecipeIsDirty((prev) => {
                if (prev) return prev;
                return true;
              });
            }}
            fitView
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            proOptions={{ hideAttribution: true }}
            selectNodesOnDrag={false}
          >
            <Controls />
            <Background
              variant={BackgroundVariant.Dots}
              gap={16}
              color="#d1d5db"
            />
          </ReactFlow>
        </div>
        {isLoading ? (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-semantic-bg-secondary">
            <div className="flex h-20 w-20 rounded bg-semantic-bg-primary">
              <svg
                className="m-auto h-6 w-6 animate-spin text-semantic-fg-secondary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          </div>
        ) : null}
      </div>
      <FlowControl accessToken={accessToken} enableQuery={enableQuery} />
    </div>
  );
});

Flow.displayName = "Flow";
