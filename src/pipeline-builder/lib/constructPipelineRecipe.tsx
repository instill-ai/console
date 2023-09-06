import { Edge, Node } from "reactflow";
import { NodeData } from "../type";
import { RawPipelineComponent } from "@instill-ai/toolkit";
import { recursivelyParseInt } from "./recursivelyParseInt";

export function constructPipelineRecipe(nodes: Node<NodeData>[]) {
  const components: RawPipelineComponent[] = [];

  for (const node of nodes) {
    if (!node.data.component) {
      continue;
    }

    const configuration = structuredClone(node.data.component.configuration);

    if (node.data.nodeType === "start") {
      components.push({
        id: "start",
        resource_name: "",
        configuration: recursivelyParseInt(configuration),
        definition_name: node.data.component.definition_name,
      });
      continue;
    }

    if (node.data.nodeType === "end") {
      components.push({
        id: "end",
        resource_name: "",
        configuration: recursivelyParseInt(configuration),
        definition_name: node.data.component.definition_name,
      });
      continue;
    }

    components.push({
      id: node.id,
      resource_name: node.data.component.resource_name,
      configuration: recursivelyParseInt(configuration),
      definition_name: node.data.component.definition_name,
    });
  }

  return {
    version: "v1alpha",
    components: components,
  };
}
