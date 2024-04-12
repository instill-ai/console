import ELK, { ElkExtendedEdge, ElkNode } from "elkjs/lib/elk.bundled.js";
import { Edge, Node, Position } from "reactflow";
import { NodeData } from "../type";

// This is the default dimension of a connector node we have right now
const START_END_COMPONENT = {
  width: 318,
  height: 54,
};

const OTHER_COMPONENT = {
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

  nodes.forEach((node) => {
    if (node.data.id === "start" || node.data.id === "end") {
      elkNodes.push({
        id: node.id,
        width: START_END_COMPONENT.width,
        height: START_END_COMPONENT.height,
      });
    } else {
      elkNodes.push({
        id: node.id,
        width: OTHER_COMPONENT.width,
        height: OTHER_COMPONENT.height,
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

      if (node.data.id === "start" || node.data.id === "end") {
        node.position = {
          x: elkNode.x - START_END_COMPONENT.width / 2,
          y: elkNode.y - START_END_COMPONENT.height / 2,
        };
        return node;
      }

      node.position = {
        x: elkNode.x - OTHER_COMPONENT.width / 2,
        y: elkNode.y - OTHER_COMPONENT.height / 2,
      };
      return node;
    }),
    edges,
  };
}
