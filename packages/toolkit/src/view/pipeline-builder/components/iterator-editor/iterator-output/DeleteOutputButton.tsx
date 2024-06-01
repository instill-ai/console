"use client";

import { Button, Icons } from "@instill-ai/design-system";
import { InstillStore, useInstillStore, useShallow } from "../../../../../lib";
import { isIteratorNode } from "../../../lib";

const selector = (store: InstillStore) => ({
  editingIteratorID: store.editingIteratorID,
  updateTempSavedNodesForEditingIteratorFlow:
    store.updateTempSavedNodesForEditingIteratorFlow,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
});

export const DeleteOutputButton = ({ outputKey }: { outputKey: string }) => {
  const {
    editingIteratorID,
    updateTempSavedNodesForEditingIteratorFlow,
    updatePipelineRecipeIsDirty,
  } = useInstillStore(useShallow(selector));

  return (
    <Button
      variant="tertiaryGrey"
      className="!p-2"
      onClick={() => {
        updateTempSavedNodesForEditingIteratorFlow((nodes) =>
          nodes.map((node) => {
            if (node.id === editingIteratorID && isIteratorNode(node)) {
              delete node.data.outputElements[outputKey];

              return {
                ...node,
                data: {
                  ...node.data,
                  outputElements: {
                    ...node.data.outputElements,
                  },
                },
              };
            }

            return node;
          })
        );

        updatePipelineRecipeIsDirty(() => true);
      }}
    >
      <Icons.Trash03 className="h-4 w-4 stroke-semantic-error-default" />
    </Button>
  );
};
