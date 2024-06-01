import { Node } from "reactflow";
import { NodeData } from "../type";
import { isIteratorNode } from "./checkNodeType";

export function getAllNodeID(nodes: Node<NodeData>[]): string[] {
  const nodeIDs: string[] = [];

  for (const node of nodes) {
    if (isIteratorNode(node)) {
      nodeIDs.push(node.id);
      nodeIDs.push(...Object.keys(node.data.component));
      continue;
    }

    nodeIDs.push(node.id);
  }

  return nodeIDs;
}
