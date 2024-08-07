import type { PipelineComponentMap, PipelineRecipe } from "instill-sdk";
import { Node } from "reactflow";

import { NodeData, ResponseNodeData, TriggerNodeData } from "../type";
import { isPipelineGeneralComponent } from "./checkComponentType";
import {
  isGeneralNode,
  isIteratorNode,
  isResponseNode,
  isVariableNode,
} from "./checkNodeType";
import { recursiveHelpers } from "./recursive-helpers";

export function composePipelineRecipeFromNodes(
  nodes: Node<NodeData>[],
): PipelineRecipe {
  const recipeComponent: PipelineComponentMap = {};

  for (const node of nodes) {
    if (isIteratorNode(node)) {
      recipeComponent[node.id] = {
        definition: undefined,
        metadata: node.data.metadata,
        input: node.data.input,
        condition: node.data.condition,
        outputElements: node.data.outputElements,
        dataSpecification: null,
        type: node.data.type,
        component: Object.fromEntries(
          Object.entries(node.data.component).map(([key, e]) => {
            if (isPipelineGeneralComponent(e)) {
              return [
                key,
                {
                  definition: undefined,
                  input: e.input
                    ? recursiveHelpers.replaceNullAndEmptyStringWithUndefined(
                        recursiveHelpers.parseToNum(structuredClone(e.input)),
                      )
                    : undefined,
                  setup: e.setup
                    ? recursiveHelpers.replaceNullAndEmptyStringWithUndefined(
                        recursiveHelpers.parseToNum(structuredClone(e.setup)),
                      )
                    : undefined,
                  condition: e.condition,
                  type: e.type,
                  task: e.task,
                  metadata: e.metadata ?? undefined,
                },
              ];
            }

            return [key, e];
          }),
        ),
      };

      continue;
    }

    if (isGeneralNode(node)) {
      recipeComponent[node.id] = {
        condition: node.data.condition,
        task: node.data.task,
        type: node.data.type,
        input: recursiveHelpers.replaceNullAndEmptyStringWithUndefined(
          recursiveHelpers.parseToNum(structuredClone(node.data.input)),
        ),
        setup: node.data.setup
          ? recursiveHelpers.replaceNullAndEmptyStringWithUndefined(
              recursiveHelpers.parseToNum(structuredClone(node.data.setup)),
            )
          : undefined,
        definition: undefined,
        metadata: node.data.metadata ?? undefined,
      };

      continue;
    }
  }

  const variableNode = nodes.find(
    (node) => node.id === "variable" && isVariableNode(node),
  ) as Node<TriggerNodeData> | undefined;

  const responseNode = nodes.find(
    (node) => node.id === "response" && isResponseNode(node),
  ) as Node<ResponseNodeData> | undefined;

  return {
    version: "v1beta",
    component: recipeComponent,
    variable: variableNode
      ? Object.keys(variableNode.data.fields).length > 0
        ? variableNode.data.fields
        : undefined
      : undefined,
    output: responseNode
      ? Object.keys(responseNode.data.fields).length > 0
        ? responseNode.data.fields
        : undefined
      : undefined,
  };
}
