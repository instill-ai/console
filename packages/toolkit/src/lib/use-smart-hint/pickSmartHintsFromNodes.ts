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

  for (const node of nodes) {
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

      continue;
    }
  }

  // Add the iterator element into the hints
  if (isEditingIterator && includeEditorElement) {
    const targetIteratorNode = tempSavedNodesForEditingIteratorFlow?.find(
      (node) =>
        node.data.id === editingIteratorID && isIteratorComponent(node.data)
    ) as Node<IteratorNodeData> | undefined;

    if (targetIteratorNode) {
      const targetHints = smartHints.find(
        (hint) => hint.path === targetIteratorNode.data.iterator_component.input
      );

      if (targetHints) {
        smartHints = [
          ...smartHints,
          {
            path: "element",
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
