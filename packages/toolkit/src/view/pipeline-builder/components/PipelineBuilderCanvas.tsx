"use client";

import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlowInstance,
  SelectionMode,
} from "reactflow";
import {
  InstillStore,
  Nullable,
  useInstillStore,
  useShallow,
} from "../../../lib";
import {
  ConnectorNode,
  EmptyNode,
  IteratorNode,
  OperatorNode,
  ResponseNode,
  TriggerNode,
} from "./nodes";
import { CustomEdge } from "./CustomEdge";
import { isResponseNode, isTriggerNode } from "../lib";

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

const nodeTypes = {
  triggerNode: TriggerNode,
  connectorNode: ConnectorNode,
  emptyNode: EmptyNode,
  responseNode: ResponseNode,
  operatorNode: OperatorNode,
  iteratorNode: IteratorNode,
};

const edgeTypes = {
  customEdge: CustomEdge,
};

const panOnDrag = [1, 2];

export const PipelineBuilderCanvas = ({
  setReactFlowInstance,
  disabledControls,
  disabledMinimap,
  bgColor,
  disabledBackground,
}: {
  setReactFlowInstance: React.Dispatch<
    React.SetStateAction<Nullable<ReactFlowInstance>>
  >;
  disabledControls?: boolean;
  disabledMinimap?: boolean;
  bgColor?: string;
  disabledBackground?: boolean;
}) => {
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
      onNodesChange={(changes) => {
        if (pipelineIsReadOnly) return;

        // The start and end operator always need to be present in the pipeline
        const nextChanges = changes.filter((change) => {
          if (change.type === "remove") {
            const node = nodes.find((node) => node.id === change.id);
            if (node?.data && (isTriggerNode(node) || isResponseNode(node))) {
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
      // To enable Figma-like zoom-in-out experience
      panOnScroll={true}
      panOnDrag={panOnDrag}
      selectionMode={SelectionMode.Partial}
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
      elevateEdgesOnSelect={false}
      selectionOnDrag={true}
    >
      {disabledControls ? null : (
        <Controls id={pipelineName ?? undefined} showInteractive={false} />
      )}
      {disabledMinimap ? null : (
        <MiniMap
          className="h-[var(--pipeline-builder-minimap-height)]"
          id={pipelineName ?? undefined}
          pannable={true}
        />
      )}
      {disabledBackground ? null : (
        <Background
          id={pipelineName ?? undefined}
          key={pipelineName}
          variant={BackgroundVariant.Dots}
          gap={32}
          color={bgColor ? bgColor : "#D2D6DB"}
          className="!bg-semantic-bg-alt-primary"
          size={3}
        />
      )}
    </ReactFlow>
  );
};
