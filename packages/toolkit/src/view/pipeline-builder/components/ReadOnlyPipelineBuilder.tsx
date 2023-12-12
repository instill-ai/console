import cn from "clsx";
import * as React from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
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
import { createInitialGraphData } from "../lib";
import { useRouter } from "next/router";
import {
  ConnectorNode,
  EmptyNode,
  EndOperatorNode,
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
};

const edgeTypes = {
  customEdge: CustomEdge,
};

export type ReadOnlyPipelineBuilderProps = {
  recipe: Nullable<PipelineRecipe>;
  metadata: Nullable<GeneralRecord>;
  className?: string;
};

export const ReadOnlyPipelineBuilder = ({
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

    const initialGraphData = createInitialGraphData(recipe, {
      metadata,
    });

    updateCurrentVersion(() => "latest");
    updatePipelineIsReadOnly(() => true);

    setNodes(initialGraphData.nodes);
    setEdges(initialGraphData.edges);
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
        "flex w-full rounded-sm border-2 border-semantic-bg-line",
        className
      )}
    >
      <ReactFlow
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
