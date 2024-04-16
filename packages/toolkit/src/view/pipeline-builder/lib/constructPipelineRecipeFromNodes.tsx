import { recursiveHelpers } from "./recursive-helpers";
import { PipelineComponent, PipelineRecipe } from "../../../lib";
import { Node } from "reactflow";
import { NodeData, ResponseNodeData, TriggerNodeData } from "../type";
import {
  isConnectorNode,
  isIteratorNode,
  isOperatorNode,
  isResponseNode,
  isTriggerNode,
} from "./checkNodeType";

export function constructPipelineRecipeFromNodes(
  nodes: Node<NodeData>[],
  removeConnectorName?: boolean
): PipelineRecipe {
  const recipeComponents: PipelineComponent[] = [];

  for (const node of nodes) {
    if (isIteratorNode(node)) {
      recipeComponents.push({
        id: node.id,
        iterator_component: {
          ...node.data.iterator_component,
        },
      });
      continue;
    }

    if (isConnectorNode(node)) {
      recipeComponents.push({
        id: node.id,
        connector_component: {
          ...node.data.connector_component,
          connector_name: removeConnectorName
            ? ""
            : node.data.connector_component.connector_name,
          input: recursiveHelpers.replaceNullAndEmptyStringWithUndefined(
            recursiveHelpers.parseToNum(
              structuredClone(node.data.connector_component.input)
            )
          ),
          definition: null,
          connector: null,
        },
      });

      continue;
    }

    if (isOperatorNode(node)) {
      recipeComponents.push({
        id: node.id,
        operator_component: {
          ...node.data.operator_component,
          input: recursiveHelpers.replaceNullAndEmptyStringWithUndefined(
            recursiveHelpers.parseToNum(
              structuredClone(node.data.operator_component.input)
            )
          ),
          definition: null,
        },
      });
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
    components: recipeComponents,
    trigger: {
      trigger_by_request: {
        request_fields: triggerNode ? triggerNode.data.fields : {},
        response_fields: responseNode ? responseNode.data.fields : {},
      },
    },
  };
}
