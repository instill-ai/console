import { Node } from "reactflow";
import {
  GeneralNodeData,
  IteratorNodeData,
  NodeData,
  ResponseNodeData,
  TriggerNodeData,
} from "../type";

export function isIteratorNode(
  node: Node<NodeData>
): node is Node<IteratorNodeData> {
  return node.type === "iteratorNode";
}

export function isVariableNode(
  node: Node<NodeData>
): node is Node<TriggerNodeData> {
  return node.type === "variableNode";
}

export function isResponseNode(
  node: Node<NodeData>
): node is Node<ResponseNodeData> {
  return node.type === "responseNode";
}

export function isGeneralNode(
  node: Node<NodeData>
): node is Node<GeneralNodeData> {
  return node.type === "generalNode";
}
