import { Node } from "reactflow";

import { NodeData } from "../type";
import { composePipelineComponentMapFromNodes } from "./composePipelineComponentMapFromNodes";
import { composePipelineMetadataMapFromNodes } from "./composePipelineMetadataMapFromNodes";

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
      const component = composePipelineComponentMapFromNodes(nodesInIterator);
      const metadata = composePipelineMetadataMapFromNodes(nodesInIterator);

      return {
        ...node,
        data: {
          ...node.data,
          component,
          metadata,
        },
      };
    }

    return node;
  });
}
