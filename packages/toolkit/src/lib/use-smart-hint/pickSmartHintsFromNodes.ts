import { Node } from "reactflow";
import {
  IteratorNodeData,
  NodeData,
  getGeneralComponentInOutputSchema,
} from "../../view";

import { SmartHint } from "./types";
import { transformInstillJSONSchemaToFormTree } from "../use-instill-form/transform";
import { transformFormTreeToSmartHints } from "./transformFormTreeToSmartHints";
import { transformPipelineTriggerRequestFieldsToSmartHints } from "./transformPipelineTriggerRequestFieldsToSmartHints";
import { PipelineIteratorComponent } from "../vdp-sdk";
import {
  isGeneralNode,
  isIteratorNode,
  isVariableNode,
} from "../../view/pipeline-builder/lib/checkNodeType";
import { isPipelineGeneralComponent } from "../../view/pipeline-builder/lib/checkComponentType";

export function pickSmartHintsFromNodes({
  nodes,
  tempSavedNodesForEditingIteratorFlow,
  isEditingIterator,
  includeEditorElement,
  editingIteratorID,
}: {
  nodes: Node<NodeData>[];
  tempSavedNodesForEditingIteratorFlow?: Node<NodeData>[];
  isEditingIterator?: boolean;
  includeEditorElement?: boolean;
  editingIteratorID?: string;
}) {
  let smartHints: SmartHint[] = [];

  const targetNodes =
    isEditingIterator && tempSavedNodesForEditingIteratorFlow
      ? [...nodes, ...tempSavedNodesForEditingIteratorFlow]
      : nodes;

  for (const node of targetNodes) {
    if (isVariableNode(node)) {
      const hints = transformPipelineTriggerRequestFieldsToSmartHints(
        node.data.fields
      );

      smartHints = [...smartHints, ...hints];

      continue;
    }

    if (isGeneralNode(node)) {
      const { outputSchema } = getGeneralComponentInOutputSchema(node.data);

      if (outputSchema) {
        const outputFormTree =
          transformInstillJSONSchemaToFormTree(outputSchema);

        const hints = transformFormTreeToSmartHints(outputFormTree, node.id);

        smartHints = [...smartHints, ...hints];
      }

      if (!isEditingIterator) {
        smartHints = [
          ...smartHints,
          {
            path: `${node.id}.output`,
            key: "output",
            instillFormat: "semi-structured/json",
            type: "object",
            properties: [],
          },
        ];
      }

      continue;
    }

    if (isIteratorNode(node)) {
      // Fragile Point:
      // Because the iterator output's generated depends on the user action
      // The dataSpecification.output may not be ready due to user haven't
      // save the changes.

      // The current solution is treating the iterator.outputElements as
      // the source of truth instead of its dataSpecification.output

      /*
       * outputElements = {
       *  result_0: "${connector_1.output.result}",
       * }
       */

      const consoleGeneratedHints: SmartHint[] = [];

      Object.entries(node.data.outputElements).forEach(([key, value]) => {
        const componentKey = value
          .replace("${", "")
          .replace("}", "")
          .split(".")[0];

        // Get target component's type
        const component = (node.data as PipelineIteratorComponent).component[
          componentKey
        ];

        if (component) {
          if (isPipelineGeneralComponent(component)) {
            const { outputSchema } =
              getGeneralComponentInOutputSchema(component);
            if (outputSchema) {
              const outputFormTree =
                transformInstillJSONSchemaToFormTree(outputSchema);
              const hints = transformFormTreeToSmartHints(
                outputFormTree,
                componentKey
              );

              const targetHint = hints.find(
                (hint) => hint.path === value.replace("${", "").replace("}", "")
              );

              if (targetHint) {
                // Iterator exposed output format will be similar to
                // iterator_0.output.result_0
                consoleGeneratedHints.push({
                  key,
                  path: `${node.id}.output.${key}`,
                  instillFormat: targetHint.instillFormat,
                  type: targetHint.type,
                  description: targetHint.description,
                });
              }
            }
          }
        }
      });

      smartHints = [...smartHints, ...consoleGeneratedHints];

      if (!isEditingIterator) {
        smartHints = [
          ...smartHints,
          {
            path: `${node.id}.output`,
            key: "output",
            instillFormat: "semi-structured/json",
            type: "object",
            properties: [],
          },
        ];
      }
    }
  }

  // Add the iterator element into the hints
  if (isEditingIterator && includeEditorElement && editingIteratorID) {
    const targetIteratorNode = tempSavedNodesForEditingIteratorFlow?.find(
      (node) => node.id === editingIteratorID && isIteratorNode(node)
    ) as Node<IteratorNodeData> | undefined;

    if (targetIteratorNode) {
      const targetHints = smartHints.find(
        (hint) =>
          hint.path ===
          targetIteratorNode.data.input.replace("${", "").replace("}", "")
      );

      if (targetHints) {
        smartHints = [
          ...smartHints,
          {
            path: `${editingIteratorID}.element`,
            key: "element",
            instillFormat: targetHints.instillFormat.replace("array:", ""),
            type: "null",
          },
        ];
      }
    }
  }

  return smartHints;
}
