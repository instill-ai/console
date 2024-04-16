import { Node } from "reactflow";
import { PipelineComponent } from "../../../lib";
import { NodeData } from "../type";
import { isIteratorNode } from "./checkNodeType";

export function composeCompleteNodesUnderEditingIteratorMode({
  editingIteratorID,
  iteratorComponents,
  allNodes,
}: {
  editingIteratorID: string;
  iteratorComponents: PipelineComponent[];
  allNodes: Node<NodeData>[];
}) {
  return allNodes.map((node) => {
    if (node.id === editingIteratorID && isIteratorNode(node)) {
      return {
        ...node,
        data: {
          ...node.data,
          iterator_component: {
            ...node.data.iterator_component,
            components: iteratorComponents,
          },
        },
      };
    }

    return node;
  });
}
