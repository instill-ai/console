import { recursiveHelpers } from "./recursive-helpers";
import { PipelineComponent, PipelineRecipe } from "../../../lib";
import { Node } from "reactflow";
import { NodeData, ResponseNodeData, TriggerNodeData } from "../type";
import {
  isGeneralNode,
  isIteratorNode,
  isResponseNode,
  isTriggerNode,
} from "./checkNodeType";
import { isPipelineGeneralComponent } from "./checkComponentType";

export function constructPipelineRecipeFromNodes(
  nodes: Node<NodeData>[]
): PipelineRecipe {
  const recipeComponents: PipelineComponent[] = [];

  for (const node of nodes) {
    if (isIteratorNode(node)) {
      recipeComponents.push({
        ...node.data,
        id: node.id,
        component: node.data.component.map((e) => {
          if (isPipelineGeneralComponent(e)) {
            return {
              ...e,
              definition: undefined,
              input: recursiveHelpers.replaceNullAndEmptyStringWithUndefined(
                recursiveHelpers.parseToNum(structuredClone(e.input))
              ),
              connection: e.connection
                ? recursiveHelpers.replaceNullAndEmptyStringWithUndefined(
                    recursiveHelpers.parseToNum(structuredClone(e.connection))
                  )
                : undefined,
            };
          }

          return e;
        }),
        metadata: node.data.metadata ?? undefined,
      });
      continue;
    }

    if (isGeneralNode(node)) {
      recipeComponents.push({
        ...node.data,
        id: node.id,
        input: recursiveHelpers.replaceNullAndEmptyStringWithUndefined(
          recursiveHelpers.parseToNum(structuredClone(node.data.input))
        ),
        connection: node.data.connection
          ? recursiveHelpers.replaceNullAndEmptyStringWithUndefined(
              recursiveHelpers.parseToNum(structuredClone(node.data.connection))
            )
          : undefined,
        definition: undefined,
        metadata: node.data.metadata ?? undefined,
      });

      continue;
    }
  }

  const triggerNode = nodes.find(
    (node) => node.id === "trigger" && isTriggerNode(node)
  ) as Node<TriggerNodeData> | undefined;

  const responseNode = nodes.find(
    (node) => node.id === "response" && isResponseNode(node)
  ) as Node<ResponseNodeData> | undefined;

  return {
    version: "v1beta",
    component: recipeComponents,
    variable: triggerNode ? triggerNode.data.fields : {},
    output: responseNode ? responseNode.data.fields : {},
  };
}
