import { Node } from "reactflow";
import {
  ConnectorNodeData,
  IteratorNodeData,
  NodeData,
  OperatorNodeData,
  ResponseNodeData,
  TriggerNodeData,
} from "../type";

export function isTriggerNode(
  node: Node<NodeData>
): node is Node<TriggerNodeData> {
  return node.id === "trigger";
}

export function isResponseNode(
  node: Node<NodeData>
): node is Node<ResponseNodeData> {
  return node.id === "response";
}

export function isConnectorNode(
  node: Node<NodeData>
): node is Node<ConnectorNodeData> {
  if (
    node.id !== "trigger" &&
    node.id !== "response" &&
    "connector_component" in node.data
  ) {
    return true;
  }

  return false;
}

export function isOperatorNode(
  node: Node<NodeData>
): node is Node<OperatorNodeData> {
  if (
    node.id !== "trigger" &&
    node.id !== "response" &&
    "operator_component" in node.data
  ) {
    return true;
  }

  return false;
}

export function isIteratorNode(
  node: Node<NodeData>
): node is Node<IteratorNodeData> {
  if (
    node.id !== "trigger" &&
    node.id !== "response" &&
    "iterator_component" in node.data
  ) {
    return true;
  }

  return false;
}
