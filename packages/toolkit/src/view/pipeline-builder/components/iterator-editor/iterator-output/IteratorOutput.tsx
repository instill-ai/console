"use client";

import * as React from "react";
import { InstillStore, useInstillStore, useShallow } from "../../../../../lib";
import { IteratorNodeData } from "../../../type";
import { Node } from "reactflow";
import { DeleteOutputButton } from "./DeleteOutputButton";
import { AddOutputButton } from "./AddOutputButton";
import { OutputValueInput } from "./OutputValueInput";
import { isIteratorNode } from "../../../lib";

const selector = (store: InstillStore) => ({
  editingIteratorID: store.editingIteratorID,
  tempSavedNodesForEditingIteratorFlow:
    store.tempSavedNodesForEditingIteratorFlow,
});

export const IteratorOutput = () => {
  const { editingIteratorID, tempSavedNodesForEditingIteratorFlow } =
    useInstillStore(useShallow(selector));

  const targetIteratorNode = React.useMemo(() => {
    return tempSavedNodesForEditingIteratorFlow.find(
      (node) => node.id === editingIteratorID && isIteratorNode(node)
    ) as Node<IteratorNodeData> | undefined;
  }, [editingIteratorID, tempSavedNodesForEditingIteratorFlow]);

  return (
    <div className="flex flex-col">
      <div className="mb-1 flex flex-row gap-x-1">
        <p className="text-semantic-fg-secondary product-body-text-4-medium">
          Output
        </p>
      </div>
      <div className="mb-2 flex flex-col gap-y-2">
        {targetIteratorNode?.data.output_elements
          ? Object.entries(targetIteratorNode?.data.output_elements).map(
              ([key]) => (
                <OutputSet
                  key={key}
                  outputKey={key}
                  disabledDeleteButton={key === "result_0"}
                />
              )
            )
          : null}
      </div>
      <AddOutputButton targetIteratorNode={targetIteratorNode ?? null} />
    </div>
  );
};

export const OutputSet = ({
  outputKey,
  disabledDeleteButton,
}: {
  outputKey: string;
  disabledDeleteButton?: boolean;
}) => {
  return (
    <div key={outputKey} className="flex flex-row items-center gap-x-3">
      <p className="text-semantic-fg-primary product-body-text-3-semibold">
        {outputKey}
      </p>
      <div className="flex flex-row gap-x-2">
        <p className="text-semantic-fg-secondary product-body-text-4-semibold">
          array of
        </p>
      </div>
      <OutputValueInput outputKey={outputKey} />
      {disabledDeleteButton ? null : (
        <DeleteOutputButton outputKey={outputKey} />
      )}
    </div>
  );
};
