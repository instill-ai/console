import { ConnectorNodeData } from "@/types";
import Elk, { ElkExtendedEdge, ElkNode } from "elkjs";
import { Edge, Node, Position } from "reactflow";

const CONNECTOR_NODE_DIMENSION = {
  width: 343,
  height: 56,
};

const MODEL_NODE_DIMENSION = {
  width: 343,
  height: 276,
};

const elk = new Elk({
  defaultLayoutOptions: {
    "elk.algorithm": "layered",
    "elk.direction": "RIGHT",
    "elk.spacing.nodeNode": "75",
    "elk.layered.spacing.nodeNodeBetweenLayers": "75",
  },
});

export async function createGraphLayout(
  nodes: Node<ConnectorNodeData>[],
  edges: Edge[]
) {
  const elkNodes: ElkNode[] = [];
  const elkEdges: ElkExtendedEdge[] = [];

  nodes.forEach((node) => {
    elkNodes.push({
      id: node.id,
      width:
        node.data.connectorType === "CONNECTOR_TYPE_AI"
          ? MODEL_NODE_DIMENSION.width
          : CONNECTOR_NODE_DIMENSION.width,
      height:
        node.data.connectorType === "CONNECTOR_TYPE_AI"
          ? MODEL_NODE_DIMENSION.height
          : CONNECTOR_NODE_DIMENSION.height,
    });
  });

  console.log(nodes, edges);

  edges.forEach((edge) => {
    elkEdges.push({
      id: edge.id,
      targets: [edge.target],
      sources: [edge.source],
    });
  });

  const newGraph = await elk.layout({
    id: "root",
    children: elkNodes,
    edges: elkEdges,
  });

  return {
    nodes: nodes.map((node) => {
      if (!newGraph.children) return node;

      const elkNode = newGraph.children.find((n) => n.id === node.id);
      node.sourcePosition = Position.Left;
      node.targetPosition = Position.Right;

      if (!elkNode) return node;

      if (!elkNode.x || !elkNode.y || !elkNode.width || !elkNode.height) {
        return node;
      }

      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      node.position = {
        x:
          node.data.connectorType === "CONNECTOR_TYPE_AI"
            ? elkNode.x - MODEL_NODE_DIMENSION.width / 2
            : elkNode.x - CONNECTOR_NODE_DIMENSION.width / 2,
        y:
          node.data.connectorType === "CONNECTOR_TYPE_AI"
            ? elkNode.y - MODEL_NODE_DIMENSION.height / 2
            : elkNode.y - CONNECTOR_NODE_DIMENSION.height / 2,
      };
      return node;
    }),
    edges,
  };
}
