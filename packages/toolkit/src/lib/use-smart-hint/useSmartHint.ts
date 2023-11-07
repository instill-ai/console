import * as React from "react";
import { useShallow } from "zustand/react/shallow";

import { InstillStore, useInstillStore } from "../use-instill-store";
import { getConnectorInputOutputSchema } from "../../view";
import { SmartHint } from "./types";
import { transformInstillJSONSchemaToFormTree } from "../use-instill-form/transform";
import { transformConnectorComponentFormTreeToSmartHints } from "./transformConnectorComponentFormTreeToSmartHints";

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
      }
    }

    updateSmartHints(() => smartHints);
  }, [nodes, updateSmartHints]);
};
