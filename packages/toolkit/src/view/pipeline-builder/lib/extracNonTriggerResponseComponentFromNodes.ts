import { Node } from "reactflow";
import { NodeData } from "../type";
import { PipelineComponent } from "../../../lib";
import { isGeneralNode, isIteratorNode } from "./checkNodeType";

export function extracNonTriggerResponseComponentFromNodes(
  nodes: Node<NodeData>[]
) {
  const components: PipelineComponent[] = [];

  for (const node of nodes) {
    if (isGeneralNode(node) || isIteratorNode(node)) {
      components.push();
    }
  }

  return components;
}
