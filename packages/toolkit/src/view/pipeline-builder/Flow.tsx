import { useShallow } from "zustand/react/shallow";
import * as React from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowInstance,
} from "reactflow";

import {
  BackToLatestVersionTopBar,
  ConnectorNode,
  CustomEdge,
  EmptyNode,
  EndOperatorNode,
  OperatorNode,
  StartOperatorNode,
} from "./components";
import { FlowControl } from "./FlowControl";

import {
  InstillAppEnv,
  InstillStore,
  Nullable,
  useInstillStore,
} from "../../lib";

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

const selector = (store: InstillStore) => ({
  nodes: store.nodes,
  edges: store.edges,
  onNodesChange: store.onNodesChange,
  onEdgesChange: store.onEdgesChange,
  onConnect: store.onConnect,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
  updateSelectedConnectorNodeId: store.updateSelectedConnectorNodeId,
  updateCurrentAdvancedConfigurationNodeID:
    store.updateCurrentAdvancedConfigurationNodeID,
  pipelineIsReadOnly: store.pipelineIsReadOnly,
  pipelineName: store.pipelineName,
});

export type FlowProps = {
  reactFlowInstance: Nullable<ReactFlowInstance>;
  setReactFlowInstance: React.Dispatch<
    React.SetStateAction<Nullable<ReactFlowInstance>>
  >;
  accessToken: Nullable<string>;
  enableQuery: boolean;
  isLoading: boolean;
  isError: boolean;
  appEnv: InstillAppEnv;
};

export const Flow = React.forwardRef<HTMLDivElement, FlowProps>(
  (props, ref) => {
    const {
      reactFlowInstance,
      setReactFlowInstance,
      accessToken,
      enableQuery,
      isLoading,
      appEnv,
    } = props;

    const {
      nodes,
      edges,
      onNodesChange,
      onEdgesChange,
      updatePipelineRecipeIsDirty,
      updateSelectedConnectorNodeId,
      updateCurrentAdvancedConfigurationNodeID,
      pipelineIsReadOnly,
      pipelineName,
    } = useInstillStore(useShallow(selector));

    return (
      <div className="relative flex flex-1 flex-col">
        <BackToLatestVersionTopBar
          enableQuery={enableQuery}
          accessToken={accessToken}
        />
        <div className="relative flex h-full w-full flex-1">
          <div ref={ref} className="h-full w-full flex-1">
            <ReactFlow
              key={pipelineName}
              nodes={nodes}
              edges={edges}
              onNodesDelete={() => {
                if (pipelineIsReadOnly) return;
                updatePipelineRecipeIsDirty(() => {
                  return true;
                });
              }}
              // Disabled delete nodes and edges by backespace
              deleteKeyCode={null}
              onEdgesDelete={() => {
                if (pipelineIsReadOnly) return;

                updatePipelineRecipeIsDirty(() => {
                  return true;
                });
              }}
              onNodesChange={(changes) => {
                if (pipelineIsReadOnly) return;

                // The start and end operator always need to be present in the pipeline
                const nextChanges = changes.filter((change) => {
                  if (change.type === "remove") {
                    const node = nodes.find((node) => node.id === change.id);
                    if (
                      node?.data.nodeType === "start" ||
                      node?.data.nodeType === "end"
                    ) {
                      return false;
                    } else {
                      return true;
                    }
                  } else {
                    return true;
                  }
                });
                onNodesChange(nextChanges);
              }}
              onEdgesChange={(changes) => {
                if (pipelineIsReadOnly) return;
                onEdgesChange(changes);
              }}
              onPaneClick={() => {
                if (pipelineIsReadOnly) return;
                updateSelectedConnectorNodeId(() => null);
                updateCurrentAdvancedConfigurationNodeID(() => null);
              }}
              // snapGrid={[32, 32]}
              // snapToGrid={true}
              onInit={setReactFlowInstance}
              fitView={true}
              fitViewOptions={{
                includeHiddenNodes: true,
                padding: 20,
              }}
              // We want to position node based on their center
              nodeOrigin={[0.5, 0.5]}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              proOptions={{ hideAttribution: true }}
              selectNodesOnDrag={false}
              nodesDraggable={!pipelineIsReadOnly}
              nodesConnectable={!pipelineIsReadOnly}
              elementsSelectable={!pipelineIsReadOnly}
              connectOnClick={!pipelineIsReadOnly}
              onError={(msgId, msg) => {
                // Nextjs strict mode will cause react-flow to throw an unnecessary error
                // "It looks like you have created a new nodeTypes or edgeTypes object"
                // the below is a workaround to suppress the error
                // https://github.com/wbkd/react-flow/issues/3065

                if (msgId === "002") {
                  return;
                }

                console.warn(msg);
              }}
              elevateNodesOnSelect={true}
              selectionOnDrag={true}
            >
              <Controls
                id={pipelineName ?? undefined}
                showInteractive={false}
              />
              <Background
                id={pipelineName ?? undefined}
                key={pipelineName}
                variant={BackgroundVariant.Dots}
                gap={32}
                color="#D2D6DB"
                className="!bg-semantic-bg-alt-primary"
                size={3}
              />
              <MiniMap
                className="h-[var(--pipeline-builder-minimap-height)]"
                id={pipelineName ?? undefined}
                pannable={true}
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
          <FlowControl reactFlowInstance={reactFlowInstance} appEnv={appEnv} />
        </div>
      </div>
    );
  }
);

Flow.displayName = "Flow";
