import { recursiveHelpers } from "./recursive-helpers";
import { PipelineComponentMap, PipelineRecipe } from "../../../lib";
import { Node } from "reactflow";
import { NodeData, ResponseNodeData, TriggerNodeData } from "../type";
import {
  isGeneralNode,
  isIteratorNode,
  isResponseNode,
  isTriggerNode,
} from "./checkNodeType";
import { isPipelineGeneralComponent } from "./checkComponentType";

export function composePipelineRecipeFromNodes(
  nodes: Node<NodeData>[]
): PipelineRecipe {
  const recipeComponent: PipelineComponentMap = {};

  for (const node of nodes) {
    if (isIteratorNode(node)) {
      recipeComponent[node.id] = {
        definition: undefined,
        metadata: node.data.metadata,
        input: node.data.input,
        condition: node.data.condition,
        output_elements: node.data.output_elements,
        data_specification: null,
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
                        recursiveHelpers.parseToNum(structuredClone(e.input))
                      )
                    : undefined,
                  connection: e.connection
                    ? recursiveHelpers.replaceNullAndEmptyStringWithUndefined(
                        recursiveHelpers.parseToNum(
                          structuredClone(e.connection)
                        )
                      )
                    : undefined,
                  condition: e.condition,
                },
              ];
            }

            return [key, e];
          })
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
          recursiveHelpers.parseToNum(structuredClone(node.data.input))
        ),
        connection: node.data.connection
          ? recursiveHelpers.replaceNullAndEmptyStringWithUndefined(
              recursiveHelpers.parseToNum(structuredClone(node.data.connection))
            )
          : undefined,
        definition: undefined,
        metadata: node.data.metadata ?? undefined,
      };

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
    component: recipeComponent,
    variable: triggerNode
      ? Object.keys(triggerNode.data.fields).length > 0
        ? triggerNode.data.fields
        : undefined
      : undefined,
    output: responseNode
      ? Object.keys(responseNode.data.fields).length > 0
        ? responseNode.data.fields
        : undefined
      : undefined,
  };
}
