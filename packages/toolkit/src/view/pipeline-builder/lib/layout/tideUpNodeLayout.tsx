import { Edge, Node, Position } from "reactflow";
import { NodeData } from "../../type";
import { ElkExtendedEdge, ElkNode } from "elkjs/lib/elk-api";
import { pipelineBuilderElkLayout } from "./pipelineBuilderElkLayout";

export async function tideUpNodeLayout(nodes: Node<NodeData>[], edges: Edge[]) {
  try {
    const elkNodes: ElkNode[] = [];
    const elkEdges: ElkExtendedEdge[] = [];

    nodes.forEach((node) => {
      if (node.id !== "trigger" && node.id !== "response") {
        elkNodes.push({
          id: node.id,
          width: node.width ?? undefined,
          height: node.height ?? undefined,
        });
      }
    });

    edges.forEach((edge) => {
      if (
        edge.source !== "trigger" &&
        edge.target !== "trigger" &&
        edge.target !== "response" &&
        edge.source !== "response"
      ) {
        elkEdges.push({
          id: edge.id,
          targets: [edge.target],
          sources: [edge.source],
        });
      }
    });

    const newGraph = await pipelineBuilderElkLayout.layout({
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

        node.position = {
          x: elkNode.x - elkNode.width / 2,
          y: elkNode.y - elkNode.height / 2,
        };
        return node;
      }),
      edges,
    };
  } catch (error) {
    console.error("Error when tide up node layout", error);
    return Promise.reject(error);
  }
}
