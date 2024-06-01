import ELK, { ElkExtendedEdge, ElkNode } from "elkjs/lib/elk.bundled.js";
import { Edge, Node, Position } from "reactflow";
import { NodeData } from "../type";

// This is the default dimension of a connector node we have right now
const TRIGGER_RESPONSE_NODE = {
  width: 318,
  height: 54,
};

const OTHER_NODE = {
  width: 318,
  height: 77,
};

const elk = new ELK({
  defaultLayoutOptions: {
    "elk.algorithm": "layered",
    "elk.direction": "RIGHT",

    /**
     * The minimal distance to be preserved between each two nodes.
     */
    "spacing.nodeNode": "50",

    /**
     * Spacing to be preserved between nodes and edges.
     */
    "spacing.edgeNode": "50",

    /**
     * Spacing to be preserved between any two edges. Note that while
     * this can somewhat easily be satisfied for the segments of orthogonally
     * drawn edges, it is harder for general polylines or splines.
     */
    "spacing.edgeEdge": "100",

    /**
     * Spacing to be preserved between pairs of edges that are routed between
     * the same pair of layers. Note that ‘spacing.edgeEdge’ is used for the
     * spacing between pairs of edges crossing the same layer.
     */
    "spacing.edgeEdgeBetweenLayers": "50",

    /**
     * The spacing to be preserved between nodes and edges that are routed
     * next to the node’s layer. For the spacing between nodes and edges
     * that cross the node’s layer ‘spacing.edgeNode’ is used.
     */
    "spacing.edgeNodeBetweenLayers": "50",

    /**
     * Spacing to be preserved between pairs of connected components.
     * This option is only relevant if ‘separateConnectedComponents’ is activated.
     */
    "spacing.componentComponent": "100",

    /**
     * The spacing to be preserved between any pair of nodes of two adjacent layers.
     * Note that ‘spacing.nodeNode’ is used for the spacing between nodes within the layer itself.
     */
    "spacing.nodeNodeBetweenLayers": "100",
  },
});

export async function createGraphLayout(
  nodes: Node<NodeData>[],
  edges: Edge[]
) {
  const elkNodes: ElkNode[] = [];
  const elkEdges: ElkExtendedEdge[] = [];

  // If the nodes only contain trigger and response node, we will directly
  // return fixed layout
  if (
    nodes.length === 2 &&
    nodes.findIndex((node) => node.id === "trigger") !== -1 &&
    nodes.findIndex((node) => node.id === "response") !== -1
  ) {
    return {
      nodes: nodes.map((node) => {
        if (node.id === "trigger") {
          node.position = { x: 0, y: 0 };
        } else {
          node.position = { x: 350, y: 0 };
        }
        return node;
      }),
      edges,
    };
  }

  nodes.forEach((node) => {
    if (node.id === "trigger" || node.id === "response") {
      elkNodes.push({
        id: node.id,
        width: TRIGGER_RESPONSE_NODE.width,
        height: TRIGGER_RESPONSE_NODE.height,
      });
    } else {
      elkNodes.push({
        id: node.id,
        width: OTHER_NODE.width,
        height: OTHER_NODE.height,
      });
    }
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

      if (node.id === "trigger" || node.id === "response") {
        node.position = {
          x: elkNode.x - TRIGGER_RESPONSE_NODE.width / 2,
          y: elkNode.y - TRIGGER_RESPONSE_NODE.height / 2,
        };
        return node;
      }

      node.position = {
        x: elkNode.x - OTHER_NODE.width / 2,
        y: elkNode.y - OTHER_NODE.height / 2,
      };
      return node;
    }),
    edges,
  };
}
