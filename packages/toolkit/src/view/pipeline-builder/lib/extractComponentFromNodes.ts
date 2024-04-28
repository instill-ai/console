import { Node } from "reactflow";
import { NodeData } from "../type";
import { PipelineComponent } from "../../../lib";
import {
  isConnectorNode,
  isIteratorNode,
  isOperatorNode,
} from "./checkNodeType";

export function extractComponentFromNodes(nodes: Node<NodeData>[]) {
  const components: PipelineComponent[] = [];

  for (const node of nodes) {
    if (isIteratorNode(node) || isConnectorNode(node) || isOperatorNode(node)) {
      components.push(node.data);
    }
  }

  return components;
}
