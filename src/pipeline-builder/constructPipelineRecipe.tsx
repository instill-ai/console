import { Edge, Node } from "reactflow";
import { NodeData } from "./type";
import { RawPipelineComponent } from "@instill-ai/toolkit";

export function constructPipelineRecipe(
  nodes: Node<NodeData>[],
  edges: Edge[]
) {
  const components: RawPipelineComponent[] = [];

  for (const node of nodes) {
    if (node.data.nodeType === "start") {
      components.push({
        ...node.data.component,
        id: "start",
        resource_name: "",
      });
      continue;
    }

    if (node.data.nodeType === "end") {
      components.push({
        ...node.data.component,
        id: "end",
        resource_name: "",
      });
      continue;
    }

    if (node.data.nodeType === "empty") {
      continue;
    }

    components.push({
      ...node.data.component,
      id: node.id,
    });
  }

  return {
    version: "v1alpha",
    components: components,
  };
}
