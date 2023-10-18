import ELK, { ElkExtendedEdge, ElkNode } from "elkjs/lib/elk.bundled.js";
import { Edge, Node, Position } from "reactflow";
import { NodeData } from "../type";

// This is the default dimension of a connector node we have right now
const CONNECTOR_NODE_DIMENSION = {
  width: 340,
  height: 305,
};

const elk = new ELK({
  defaultLayoutOptions: {
    "elk.algorithm": "layered",
    "elk.direction": "RIGHT",
    "elk.spacing.nodeNode": "50",
    "elk.layered.spacing.nodeNodeBetweenLayers": "200",
  },
});

export async function createGraphLayout(
  nodes: Node<NodeData>[],
  edges: Edge[]
) {
  const elkNodes: ElkNode[] = [];
  const elkEdges: ElkExtendedEdge[] = [];

  nodes.forEach((node) => {
    elkNodes.push({
      id: node.id,
      width: CONNECTOR_NODE_DIMENSION.width,
      height: CONNECTOR_NODE_DIMENSION.height,
    });
  });

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
        x: elkNode.x - CONNECTOR_NODE_DIMENSION.width / 2,
        y: elkNode.y - CONNECTOR_NODE_DIMENSION.height / 2,
      };
      return node;
    }),
    edges,
  };
}
