import { Node } from "reactflow";
import { NodeData } from "../type";
import { extracNonTriggerResponseComponentFromNodes } from "./extracNonTriggerResponseComponentFromNodes";
import { composePipelineMetadataFromNodes } from "./composePipelineMetadataFromNodes";

export function composeCompleteNodesUnderEditingIteratorMode({
  editingIteratorID,
  nodesInIterator,
  nodesOutsideIterator,
}: {
  editingIteratorID: string;
  nodesInIterator: Node<NodeData>[];
  nodesOutsideIterator: Node<NodeData>[];
}): Node<NodeData>[] {
  return nodesOutsideIterator?.map((node) => {
    if (node.id === editingIteratorID && node.type === "iteratorNode") {
      const components =
        extracNonTriggerResponseComponentFromNodes(nodesInIterator);
      const metadata = composePipelineMetadataFromNodes(nodesInIterator);

      return {
        ...node,
        data: {
          ...node.data,
          components,
          metadata,
        },
      };
    }

    return node;
  });
}
