import { Edge, Node } from "reactflow";
import { NodeData } from "../type";
import { RawPipelineComponent } from "@instill-ai/toolkit";
import { recursiveParseToInt } from "./recursiveParseToInt";
import { recursivelyReplaceNullAndEmptyStringWithUndefined } from "./recursivelyReplaceNullAndEmptyStringWithUndefined";

export function constructPipelineRecipe(nodes: Node<NodeData>[]) {
  const components: RawPipelineComponent[] = [];

  for (const node of nodes) {
    if (!node.data.component) {
      continue;
    }

    const configuration = recursivelyReplaceNullAndEmptyStringWithUndefined(
      structuredClone(node.data.component.configuration)
    );

    console.log();

    if (node.data.nodeType === "start") {
      components.push({
        id: "start",
        resource_name: "",
        configuration: {
          ...recursiveParseToInt(configuration),
          connector_definition_name: undefined,
        },
        definition_name: node.data.component.definition_name,
      });
      continue;
    }

    if (node.data.nodeType === "end") {
      components.push({
        id: "end",
        resource_name: "",
        configuration: {
          ...recursiveParseToInt(configuration),
          connector_definition_name: undefined,
        },
        definition_name: node.data.component.definition_name,
      });
      continue;
    }

    const parsedIntConfiguration = recursiveParseToInt(configuration);

    components.push({
      id: node.id,
      resource_name: node.data.component.resource_name,
      configuration: {
        ...parsedIntConfiguration,
        input: {
          ...parsedIntConfiguration.input,
          connector_definition_name: undefined,
        },
      },
      definition_name: node.data.component.definition_name,
    });
  }

  return {
    version: "v1alpha",
    components: components,
  };
}
