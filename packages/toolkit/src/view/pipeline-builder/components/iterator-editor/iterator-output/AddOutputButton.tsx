"use client";

import { Node } from "reactflow";
import {
  InstillStore,
  Nullable,
  useInstillStore,
  useShallow,
} from "../../../../../lib";
import { IteratorNodeData } from "../../../type";
import { Button } from "@instill-ai/design-system";
import { isIteratorNode } from "../../../lib";

const selector = (store: InstillStore) => ({
  editingIteratorID: store.editingIteratorID,
  updateTempSavedNodesForEditingIteratorFlow:
    store.updateTempSavedNodesForEditingIteratorFlow,
});

export const AddOutputButton = ({
  targetIteratorNode,
}: {
  targetIteratorNode: Nullable<Node<IteratorNodeData>>;
}) => {
  const { editingIteratorID, updateTempSavedNodesForEditingIteratorFlow } =
    useInstillStore(useShallow(selector));

  return (
    <div className="flex">
      <Button
        onClick={() => {
          let newOutputElements = {};

          if (targetIteratorNode?.data.outputElements) {
            const currentIndexArray = Object.keys(
              targetIteratorNode?.data.outputElements
            )
              .map((key) => key.replace("result_", ""))
              .map(Number)
              .sort((a, b) => b - a);

            newOutputElements = {
              ...targetIteratorNode?.data.outputElements,
              [`result_${currentIndexArray[0] === 0 ? 1 : currentIndexArray[0] + 1}`]:
                "",
            };
          }
          updateTempSavedNodesForEditingIteratorFlow((nodes) =>
            nodes.map((node) => {
              if (node.id === editingIteratorID && isIteratorNode(node)) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    outputElements: newOutputElements,
                  },
                };
              }

              return node;
            })
          );
        }}
        variant="secondaryGrey"
        size="sm"
      >
        Add Result
      </Button>
    </div>
  );
};
