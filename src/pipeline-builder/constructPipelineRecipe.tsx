import { Edge, Node } from "reactflow";
import { NodeData } from "./type";
import { RawPipelineRecipeComponent } from "@instill-ai/toolkit";

export function constructPipelineRecipe(
  nodes: Node<NodeData>[],
  edges: Edge[]
) {
  const components: RawPipelineRecipeComponent[] = [];

  for (const node of nodes) {
    if (node.data.nodeType === "start") {
      components.push({
        id: "start",
        resource_name: "",
      });
      continue;
    }

    if (node.data.nodeType === "end") {
      components.push({
        id: "end",
        resource_name: "",
      });
      continue;
    }

    if (node.data.nodeType === "empty") {
      continue;
    }

    components.push({
      id: node.id,
      resource_name: node.data.connector.name,
    });
  }

  return {
    version: "v1alpha",
    components: components,
  };
}
