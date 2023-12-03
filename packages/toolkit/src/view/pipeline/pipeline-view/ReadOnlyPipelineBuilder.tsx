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
  NodeData,
  OperatorNode,
  StartOperatorNode,
  createInitialGraphData,
} from "../../pipeline-builder";
import {
  InstillStore,
  useInstillStore,
  useShallow,
  useUserPipeline,
} from "../../../lib";
import { useRouter } from "next/router";
import * as React from "react";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
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

export const ReadOnlyPipelineBuilder = () => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const router = useRouter();
  const { id, entity } = router.query;

  const [nodes, setNodes] = React.useState<Node<NodeData>[]>([]);
  const [edges, setEdges] = React.useState<Edge[]>([]);

  const pipeline = useUserPipeline({
    pipelineName: id ? `users/${entity}/pipelines/${id}` : null,
    accessToken,
    enabled: enabledQuery && !!id && !!accessToken,
  });

  React.useEffect(() => {
    if (!pipeline.isSuccess) return;

    const initialGraphData = createInitialGraphData(pipeline.data.recipe, {
      metadata: pipeline.data.metadata,
    });

    setNodes(initialGraphData.nodes);
    setEdges(initialGraphData.edges);
  }, [pipeline.isSuccess, pipeline.data]);

  return (
    <div className="flex h-[308px] w-[606px] rounded-sm border border-semantic-bg-line">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView={true}
        fitViewOptions={{
          includeHiddenNodes: true,
          maxZoom: 5,
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
