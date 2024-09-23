import { Node } from "reactflow";

import {
  GeneralNodeData,
  IteratorNodeData,
  NodeData,
  OutputNodeData,
  RunOnEventNodeData,
  VariableNodeData,
} from "../flow/types";

function isVariableNode(node: Node<NodeData>): node is Node<VariableNodeData> {
  return node.type === "variableNode";
}

function isOutputNode(node: Node<NodeData>): node is Node<OutputNodeData> {
  return node.type === "responseNode";
}

function isIteratorNode(node: Node<NodeData>): node is Node<IteratorNodeData> {
  return node.type === "iteratorNode";
}

function isGeneralNode(node: Node<NodeData>): node is Node<GeneralNodeData> {
  return node.type === "generalNode";
}

function isRunOnEventNode(
  node: Node<NodeData>,
): node is Node<RunOnEventNodeData> {
  return node.type === "runOnEventNode";
}

export const checkNodeTypeHelper = {
  isVariableNode,
  isOutputNode,
  isIteratorNode,
  isGeneralNode,
  isRunOnEventNode,
};
