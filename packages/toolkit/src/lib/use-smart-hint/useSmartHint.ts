import * as React from "react";
import { useShallow } from "zustand/react/shallow";

import { InstillStore, useInstillStore } from "../use-instill-store";
import { getConnectorInputOutputSchema } from "../../view";
import { SmartHint } from "./types";
import { transformInstillJSONSchemaToFormTree } from "../use-instill-form/transform";
import { transformConnectorComponentFormTreeToSmartHints } from "./transformConnectorComponentFormTreeToSmartHints";
import { transformStartOperatorFieldsToSmartHints } from "./transformStartOperatorFieldsToSmartHints";
import { getOperatorInputOutputSchema } from "../../view/pipeline-builder/lib/getOperatorInputOutputSchema";
import {
  isConnectorComponent,
  isOperatorComponent,
  isStartComponent,
} from "../../view/pipeline-builder/lib/checkComponentType";

const selector = (store: InstillStore) => ({
  updateSmartHints: store.updateSmartHints,
  nodes: store.nodes,
  tempSavedNodesForEditingIteratorFlow:
    store.tempSavedNodesForEditingIteratorFlow,
});

export const useSmartHint = () => {
  const { updateSmartHints, nodes, tempSavedNodesForEditingIteratorFlow } =
    useInstillStore(useShallow(selector));

  React.useEffect(() => {
    let smartHints: SmartHint[] = [];

    // User can reference nodes outside of the iterator flow
    const targetNodes = [...tempSavedNodesForEditingIteratorFlow, ...nodes];

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

    updateSmartHints(() => smartHints);
  }, [nodes, updateSmartHints]);
};
