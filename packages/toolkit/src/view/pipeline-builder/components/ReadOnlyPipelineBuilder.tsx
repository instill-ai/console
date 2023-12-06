import cn from "clsx";
import * as React from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Edge,
  Node,
} from "reactflow";
import {
  ConnectorNode,
  CustomEdge,
  EmptyNode,
  EndOperatorNode,
  OperatorNode,
  StartOperatorNode,
} from ".";
import { GeneralRecord, Nullable, PipelineRecipe } from "../../../lib";
import { NodeData } from "../type";
import { createInitialGraphData } from "../lib";

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
  const [nodes, setNodes] = React.useState<Node<NodeData>[]>([]);
  const [edges, setEdges] = React.useState<Edge[]>([]);

  React.useEffect(() => {
    if (!recipe || !metadata) return;

    const initialGraphData = createInitialGraphData(recipe, {
      metadata,
    });

    setNodes(initialGraphData.nodes);
    setEdges(initialGraphData.edges);
  }, [recipe, metadata]);

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
        fitViewOptions={{
          includeHiddenNodes: true,
          maxZoom: 5,
          minZoom: 0.3,
          padding: 20,
        }}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        proOptions={{ hideAttribution: true }}
        selectNodesOnDrag={false}
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
