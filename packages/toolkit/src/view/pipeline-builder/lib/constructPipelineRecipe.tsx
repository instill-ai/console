import { Node } from "reactflow";
import { NodeData } from "../type";
import { recursiveParseToNum } from "./recursiveParseToNum";
import { RawPipelineComponent } from "../../../lib";
import { recursiveReplaceNullAndEmptyStringWithUndefined } from "./recursiveReplaceNullAndEmptyStringWithUndefined";

export function constructPipelineRecipe(
  nodes: Node<NodeData>[],
  removeResourceName?: boolean
) {
  const components: RawPipelineComponent[] = [];

  for (const node of nodes) {
    if (!node.data.component) {
      continue;
    }

    const configuration = recursiveReplaceNullAndEmptyStringWithUndefined(
      structuredClone(node.data.component.configuration)
    );

    if (node.data.nodeType === "start") {
      components.push({
        id: "start",
        resource_name: "",
        configuration: {
          ...recursiveParseToNum(configuration),
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
          ...recursiveParseToNum(configuration),
          connector_definition_name: undefined,
        },
        definition_name: node.data.component.definition_name,
      });
      continue;
    }

    const parsedIntConfiguration = recursiveParseToNum(configuration);

    components.push({
      id: node.id,

      // Backend accept resource_name with empty string
      resource_name: removeResourceName
        ? ""
        : node.data.component.resource_name ?? "",
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
    version: "v1beta",
    components: components,
  };
}
