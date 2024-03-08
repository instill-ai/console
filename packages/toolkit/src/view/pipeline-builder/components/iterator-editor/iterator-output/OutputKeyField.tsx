import { Input } from "@instill-ai/design-system";
import React from "react";
import { Nullable } from "vitest";
import { InstillStore, useInstillStore, useShallow } from "../../../../../lib";
import { isIteratorComponent } from "../../../lib/checkComponentType";

const selector = (store: InstillStore) => ({
  editingIteratorID: store.editingIteratorID,
  updateTempSavedNodesForEditingIteratorFlow:
    store.updateTempSavedNodesForEditingIteratorFlow,
});

export const OutputKeyField = ({
  outputKey,
  outputValue,
}: {
  outputKey: string;
  outputValue: string;
}) => {
  const [keyInput, setKeyInput] = React.useState(outputKey);
  const timer = React.useRef<Nullable<number>>(null);
  const { editingIteratorID, updateTempSavedNodesForEditingIteratorFlow } =
    useInstillStore(useShallow(selector));

  React.useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = window.setTimeout(() => {
      updateTempSavedNodesForEditingIteratorFlow((nodes) =>
        nodes.map((node) => {
          if (
            node.data.id === editingIteratorID &&
            isIteratorComponent(node.data)
          ) {
            delete node.data.iterator_component.output_elements[outputKey];

            return {
              ...node,
              data: {
                ...node.data,
                iterator_component: {
                  ...node.data.iterator_component,
                  output_elements: {
                    ...node.data.iterator_component.output_elements,
                    [keyInput]: outputValue,
                  },
                },
              },
            };
          }

          return node;
        })
      );
    }, 1000);
  }, [
    keyInput,
    outputValue,
    editingIteratorID,
    outputKey,
    updateTempSavedNodesForEditingIteratorFlow,
  ]);

  return (
    <Input.Root className="!h-10">
      <Input.Core
        value={keyInput}
        onChange={(e) => {
          setKeyInput(e.target.value);
        }}
      />
    </Input.Root>
  );
};
