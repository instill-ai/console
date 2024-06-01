import { Node } from "reactflow";
import { NodeData, PipelineComponentMetadataMap } from "../type";

export function composePipelineMetadataMapFromNodes(nodes: Node<NodeData>[]) {
  const componentMetadatas: PipelineComponentMetadataMap = {};

  for (const node of nodes) {
    componentMetadatas[node.id] = {
      note: node.data.note,
      x: node.position.x,
      y: node.position.y,
    };
  }

  return {
    component: componentMetadatas,
  };
}
