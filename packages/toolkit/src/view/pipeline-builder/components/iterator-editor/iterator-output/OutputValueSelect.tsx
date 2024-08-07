"use client";

import * as React from "react";
import { Node } from "reactflow";

import { Select } from "@instill-ai/design-system";

import {
  InstillStore,
  Nullable,
  pickSmartHintsFromNodes,
  useInstillStore,
  useShallow,
} from "../../../../../lib";
import { isIteratorNode } from "../../../lib";
import { IteratorNodeData } from "../../../type";
import { InOutputOption } from "../IteratorEditor";

const selector = (store: InstillStore) => ({
  nodes: store.nodes,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
  tempSavedNodesForEditingIteratorFlow:
    store.tempSavedNodesForEditingIteratorFlow,
  updateTempSavedNodesForEditingIteratorFlow:
    store.updateTempSavedNodesForEditingIteratorFlow,
  editingIteratorID: store.editingIteratorID,
});

export const OutputValueSelect = ({ outputKey }: { outputKey: string }) => {
  const {
    nodes,
    updatePipelineRecipeIsDirty,
    tempSavedNodesForEditingIteratorFlow,
    updateTempSavedNodesForEditingIteratorFlow,
    editingIteratorID,
  } = useInstillStore(useShallow(selector));
  const [selectedOutputOption, setSelectedOutputOption] =
    React.useState<Nullable<InOutputOption>>(null);

  const availableOutputOptions = React.useMemo(() => {
    // User can only set the output from the iterator's components
    const hints = pickSmartHintsFromNodes({
      nodes,
      includeEditorElement: false,
    });

    return hints.map((hint) => ({
      path: hint.path,
      instillFormat: hint.instillFormat,
      description: hint.description,
      type: hint.type,
    }));
  }, [nodes]);

  React.useEffect(() => {
    const targetNodes = tempSavedNodesForEditingIteratorFlow.find(
      (node) => node.id === editingIteratorID && isIteratorNode(node),
    ) as Node<IteratorNodeData> | undefined;

    if (targetNodes) {
      const outputOption = availableOutputOptions.find((option) => {
        const outputElementValue = targetNodes?.data.outputElements[outputKey];
        if (
          outputElementValue &&
          option.path === outputElementValue.replace("${", "").replace("}", "")
        ) {
          return true;
        }

        return false;
      });

      setSelectedOutputOption(outputOption ?? null);
    }
  }, [
    availableOutputOptions,
    outputKey,
    nodes,
    tempSavedNodesForEditingIteratorFlow,
    editingIteratorID,
  ]);

  return (
    <Select.Root
      value={selectedOutputOption?.path}
      onValueChange={(value) => {
        const option = availableOutputOptions.find(
          (option) => option.path === value,
        );

        if (option) {
          setSelectedOutputOption(option);
          updatePipelineRecipeIsDirty(() => true);
          updateTempSavedNodesForEditingIteratorFlow((nodes) =>
            nodes.map((node) => {
              if (node.id === editingIteratorID && isIteratorNode(node)) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    outputElements: {
                      ...node.data.outputElements,
                      [outputKey]: "${" + `${option.path}` + "}",
                    },
                  },
                };
              }

              return node;
            }),
          );
        }
      }}
    >
      <Select.Trigger className="!w-[245px]">
        <Select.Value aria-label={selectedOutputOption?.path}>
          {selectedOutputOption ? (
            <p className="rounded bg-semantic-accent-bg px-2 py-0.5 text-semantic-accent-default product-body-text-4-medium">
              {"$" + `{${selectedOutputOption?.path}}`}
            </p>
          ) : null}
        </Select.Value>
      </Select.Trigger>
      <Select.Content viewportClassName="!p-0">
        {availableOutputOptions.map((option) => (
          <Select.Item
            className="!p-2 !product-body-text-4-semibold focus:!text-[#1E4EAE] data-[highlighted]:!bg-semantic-accent-bg"
            key={option.path}
            value={option.path}
            disabledCheck={true}
            label={option.path}
          />
        ))}
      </Select.Content>
    </Select.Root>
  );
};
