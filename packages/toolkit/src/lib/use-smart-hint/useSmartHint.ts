import * as React from "react";
import { useShallow } from "zustand/react/shallow";

import { InstillStore, useInstillStore } from "../use-instill-store";
import { getConnectorInputOutputSchema } from "../../view";
import { SmartHint } from "./types";
import { transformInstillJSONSchemaToFormTree } from "../use-instill-form/transform";
import { transformConnectorComponentFormTreeToSmartHints } from "./transformConnectorComponentFormTreeToSmartHints";
import { transformStartOperatorMetadataToSmartHints } from "./transformStartOperatorMetadataToSmartHints";
import { getOperatorInputOutputSchema } from "../../view/pipeline-builder/lib/getOperatorInputOutputSchema";

const selector = (store: InstillStore) => ({
  updateSmartHints: store.updateSmartHints,
  nodes: store.nodes,
});

export const useSmartHint = () => {
  const { updateSmartHints, nodes } = useInstillStore(useShallow(selector));

  React.useEffect(() => {
    let smartHints: SmartHint[] = [];

    for (const node of nodes) {
      if (node.data.nodeType === "connector") {
        const { outputSchema } = getConnectorInputOutputSchema(
          node.data.component
        );

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
            instillFormat: "null",
            type: "object",
            properties: [],
          },
        ];
      }

      if (node.data.nodeType === "start") {
        if (!node.data.component.configuration.metadata) {
          continue;
        }

        const hints = transformStartOperatorMetadataToSmartHints(
          node.data.component.configuration.metadata
        );

        smartHints = [...smartHints, ...hints];
      }

      if (node.data.nodeType === "operator") {
        const { outputSchema } = getOperatorInputOutputSchema(
          node.data.component
        );

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
            instillFormat: "null",
            type: "object",
            properties: [],
          },
        ];
      }
    }

    updateSmartHints(() => smartHints);
  }, [nodes, updateSmartHints]);
};
