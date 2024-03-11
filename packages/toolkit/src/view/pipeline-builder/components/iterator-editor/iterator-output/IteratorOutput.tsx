import * as React from "react";
import { InstillStore, useInstillStore, useShallow } from "../../../../../lib";
import { isIteratorComponent } from "../../../lib/checkComponentType";
import { IteratorNodeData } from "../../../type";
import { Node } from "reactflow";
import { OutputValueSelect } from "./OutputValueSelect";
import { DeleteOutputButton } from "./DeleteOutputButton";
import { AddOutputButton } from "./AddOutputButton";

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
      (node) =>
        node.data.id === editingIteratorID && isIteratorComponent(node.data)
    ) as Node<IteratorNodeData> | null;
  }, [editingIteratorID, tempSavedNodesForEditingIteratorFlow]);

  return (
    <div className="flex flex-col">
      <div className="mb-1 flex flex-row gap-x-1">
        <p className="text-semantic-fg-secondary product-body-text-4-medium">
          Output
        </p>
      </div>
      <div className="mb-2 flex flex-col gap-y-2">
        {targetIteratorNode?.data.iterator_component.output_elements
          ? Object.entries(
              targetIteratorNode?.data.iterator_component.output_elements
            ).map(([key]) => (
              <OutputSet
                key={key}
                outputKey={key}
                disabledDeleteButton={key === "result_0"}
              />
            ))
          : null}
      </div>
      <AddOutputButton targetIteratorNode={targetIteratorNode} />
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
      <OutputValueSelect outputKey={outputKey} />
      {disabledDeleteButton ? null : (
        <DeleteOutputButton outputKey={outputKey} />
      )}
    </div>
  );
};
