import { Node } from "reactflow";
import { NodeData } from "../type";
import { isIteratorNode } from "./checkNodeType";
import { extractComponentFromNodes } from "./extractComponentFromNodes";
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
    if (node.id === editingIteratorID && isIteratorNode(node)) {
      const components = extractComponentFromNodes(nodesInIterator);
      const metadata = composePipelineMetadataFromNodes(nodesInIterator);

      return {
        ...node,
        data: {
          ...node.data,
          iterator_component: {
            ...node.data.iterator_component,
            components,
          },
          metadata,
        },
      };
    }

    return node;
  });
}
