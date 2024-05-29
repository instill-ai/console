"use client";

import * as React from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  ControlButton,
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
  EmptyNode,
  IteratorNode,
  ResponseNode,
  VariableNode,
  GeneralNode,
} from "./nodes";
import { CustomEdge } from "./CustomEdge";
import { isResponseNode, isVariableNode } from "../lib";
import { canvasPanOnDrag } from "./canvasPanOnDrag";
import { Icons } from "@instill-ai/design-system";

const selector = (store: InstillStore) => ({
  nodes: store.nodes,
  updateNodes: store.updateNodes,
  edges: store.edges,
  updateEdges: store.updateEdges,
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
  variableNode: VariableNode,
  emptyNode: EmptyNode,
  responseNode: ResponseNode,
  iteratorNode: IteratorNode,
  generalNode: GeneralNode,
};

const edgeTypes = {
  customEdge: CustomEdge,
};

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
    updateNodes,
    edges,
    updateEdges,
    onNodesChange,
    onEdgesChange,
    updatePipelineRecipeIsDirty,
    updateSelectedConnectorNodeId,
    updateCurrentAdvancedConfigurationNodeID,
    pipelineIsReadOnly,
    pipelineName,
  } = useInstillStore(useShallow(selector));

  const [miniMapIsOpen, setMiniMapIsOpen] = React.useState(
    disabledMinimap ?? false,
  );

  React.useEffect(() => {
    console.log("nodes update", nodes);
  }, [nodes]);

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
            if (node?.data && (isVariableNode(node) || isResponseNode(node))) {
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
      onMove={() => {
        if (pipelineIsReadOnly) return;
        updateSelectedConnectorNodeId(() => null);
        updateCurrentAdvancedConfigurationNodeID(() => null);
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
      panOnDrag={canvasPanOnDrag}
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
        <Controls id={pipelineName ?? undefined} showInteractive={false}>
          <ControlButton
            onClick={() => {
              if (disabledMinimap) return;
              setMiniMapIsOpen((prev) => !prev);
            }}
          >
            <Icons.Map01 className="h-4 w-4 stroke-semantic-fg-primary" />
          </ControlButton>
          <ControlButton
            onClick={async () => {
              const newLayout = await tideUpNodeLayout(nodes, edges);
              updateNodes(() => newLayout.nodes);
              updateEdges(() => newLayout.edges);
            }}
          >
            <Icons.Grid01 className="h-4 w-4 stroke-semantic-fg-primary" />
          </ControlButton>
        </Controls>
      )}
      {disabledMinimap ? null : miniMapIsOpen ? (
        <MiniMap
          className="h-[var(--pipeline-builder-minimap-height)] translate-x-10"
          id={pipelineName ?? undefined}
          pannable={true}
          position="bottom-left"
        />
      ) : null}
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
