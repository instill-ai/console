"use client";

import { Input } from "@instill-ai/design-system";
import * as React from "react";
import {
  InstillStore,
  Nullable,
  useInstillStore,
  useShallow,
} from "../../../../../lib";
import { isIteratorNode } from "../../../lib";

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
          if (node.data.id === editingIteratorID && isIteratorNode(node)) {
            delete node.data.output_elements[outputKey];

            return {
              ...node,
              data: {
                ...node.data,
                output_elements: {
                  ...node.data.output_elements,
                  [keyInput]: outputValue,
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
