import { Node } from "reactflow";
import { NodeData, PipelineComponentMetadata } from "../type";

export function composePipelineMetadataFromNodes(nodes: Node<NodeData>[]) {
  const componentMetadatas: PipelineComponentMetadata[] = [];

  for (const node of nodes) {
    if (!node.data.component) continue;

    componentMetadatas.push({
      id: node.id,
      note: node.data.note,
      x: node.position.x,
      y: node.position.y,
    });
  }

  return {
    components: componentMetadatas,
  };
}
