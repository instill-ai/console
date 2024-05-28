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
        ...node.data,
        component: Object.fromEntries(
          Object.entries(node.data.component).map(([key, e]) => {
            if (isPipelineGeneralComponent(e)) {
              return [
                key,
                {
                  ...e,
                  definition: undefined,
                  input:
                    recursiveHelpers.replaceNullAndEmptyStringWithUndefined(
                      recursiveHelpers.parseToNum(structuredClone(e.input))
                    ),
                  connection: e.connection
                    ? recursiveHelpers.replaceNullAndEmptyStringWithUndefined(
                        recursiveHelpers.parseToNum(
                          structuredClone(e.connection)
                        )
                      )
                    : undefined,
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
        ...node.data,
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
    variable: triggerNode ? triggerNode.data.fields : {},
    output: responseNode ? responseNode.data.fields : {},
  };
}
