import { Node } from "reactflow";
import {
  IteratorNodeData,
  NodeData,
  getConnectorInputOutputSchema,
} from "../../view";
import {
  isConnectorComponent,
  isIteratorComponent,
  isOperatorComponent,
  isStartComponent,
} from "../../view/pipeline-builder/lib/checkComponentType";
import { SmartHint } from "./types";
import { transformInstillJSONSchemaToFormTree } from "../use-instill-form/transform";
import { transformConnectorComponentFormTreeToSmartHints } from "./transformConnectorComponentFormTreeToSmartHints";
import { transformStartOperatorFieldsToSmartHints } from "./transformStartOperatorFieldsToSmartHints";
import { getOperatorInputOutputSchema } from "../../view/pipeline-builder/lib/getOperatorInputOutputSchema";
import { PipelineIteratorComponent } from "../vdp-sdk";

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
    if (isStartComponent(node.data)) {
      const hints = transformStartOperatorFieldsToSmartHints(
        node.data.start_component.fields
      );

      smartHints = [...smartHints, ...hints];

      continue;
    }

    if (isConnectorComponent(node.data)) {
      const { outputSchema } = getConnectorInputOutputSchema(node.data);

      if (outputSchema) {
        const outputFormTree =
          transformInstillJSONSchemaToFormTree(outputSchema);

        const hints = transformConnectorComponentFormTreeToSmartHints(
          outputFormTree,
          node.id
        );

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

    if (isOperatorComponent(node.data)) {
      const { outputSchema } = getOperatorInputOutputSchema(node.data);

      if (outputSchema) {
        const outputFormTree =
          transformInstillJSONSchemaToFormTree(outputSchema);

        const hints = transformConnectorComponentFormTreeToSmartHints(
          outputFormTree,
          node.id
        );

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

    if (isIteratorComponent(node.data)) {
      const outputSchema =
        node.data.iterator_component.data_specification.output;

      if (outputSchema) {
        const outputFormTree =
          transformInstillJSONSchemaToFormTree(outputSchema);

        const hints = transformConnectorComponentFormTreeToSmartHints(
          outputFormTree,
          node.id
        );

        // Fragile Point:
        // Because the iterator output's generated depends on the user action
        // The data_specification.output may not be ready due to user haven't
        // save the changes. So we need to take a look at the unsaved
        // output_elements and generate the hint from it.

        /*
         * output_elements = {
         *  result_0: "${connector_1.output.result}",
         * }
         */

        /*
         * unsavedIteratorOutput = [["result_0", "${connector_1.output.result}"]]
         */
        const unsavedIteratorOutput = Object.entries(
          node.data.iterator_component.output_elements
        ).filter(([key]) => hints.some((hint) => hint.key !== key));

        const unsavedOutputHints: SmartHint[] = [];

        unsavedIteratorOutput.forEach(([key, value]) => {
          const componentKey = value
            .replace("${", "")
            .replace("}", "")
            .split(".")[0];

          // Get target component's type
          const component = (
            node.data as PipelineIteratorComponent
          ).iterator_component.components.find(
            (component) => component.id === componentKey
          );

          if (component) {
            if (isConnectorComponent(component)) {
              const { outputSchema } = getConnectorInputOutputSchema(component);
              if (outputSchema) {
                const outputFormTree =
                  transformInstillJSONSchemaToFormTree(outputSchema);
                const hints = transformConnectorComponentFormTreeToSmartHints(
                  outputFormTree,
                  component.id
                );

                const targetHint = hints.find(
                  (hint) =>
                    hint.path === value.replace("${", "").replace("}", "")
                );

                if (targetHint) {
                  // Iterator exposed output format will be similar to
                  // iterator_0.output.result_0
                  unsavedOutputHints.push({
                    key,
                    path: `${node.id}.output.${key}`,
                    instillFormat: targetHint.instillFormat,
                    type: targetHint.type,
                    description: targetHint.description,
                  });
                }
              }
            }

            if (isOperatorComponent(component)) {
              const { outputSchema } = getOperatorInputOutputSchema(component);
              if (outputSchema) {
                const outputFormTree =
                  transformInstillJSONSchemaToFormTree(outputSchema);
                const hints = transformConnectorComponentFormTreeToSmartHints(
                  outputFormTree,
                  component.id
                );

                const targetHint = hints.find(
                  (hint) =>
                    hint.path === value.replace("${", "").replace("}", "")
                );

                if (targetHint) {
                  unsavedOutputHints.push({
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

        console.log(
          hints,
          unsavedIteratorOutput,
          node.data.iterator_component.output_elements,
          unsavedOutputHints
        );

        smartHints = [...smartHints, ...hints, ...unsavedOutputHints];
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
    }
  }

  // Add the iterator element into the hints
  if (isEditingIterator && includeEditorElement && editingIteratorID) {
    const targetIteratorNode = tempSavedNodesForEditingIteratorFlow?.find(
      (node) =>
        node.data.id === editingIteratorID && isIteratorComponent(node.data)
    ) as Node<IteratorNodeData> | undefined;

    if (targetIteratorNode) {
      const targetHints = smartHints.find(
        (hint) =>
          hint.path ===
          targetIteratorNode.data.iterator_component.input
            .replace("${", "")
            .replace("}", "")
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
