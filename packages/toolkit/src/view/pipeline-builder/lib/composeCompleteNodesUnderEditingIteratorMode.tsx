import { Node } from "reactflow";
import { PipelineComponent } from "../../../lib";
import { isIteratorComponent } from "./checkComponentType";
import { NodeData } from "../type";

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
    if (node.id === editingIteratorID && isIteratorComponent(node.data)) {
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
