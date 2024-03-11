import * as React from "react";
import {
  InstillStore,
  Nullable,
  pickSmartHintsFromNodes,
  useInstillStore,
  useShallow,
} from "../../../../../lib";
import { InOutputOption } from "../IteratorEditor";
import { Select } from "@instill-ai/design-system";
import { isIteratorComponent } from "../../../lib/checkComponentType";
import { Node } from "reactflow";
import { IteratorNodeData } from "../../../type";

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
      instill_format: hint.instillFormat,
      description: hint.description,
    }));
  }, [nodes]);

  React.useEffect(() => {
    const targetNodes = tempSavedNodesForEditingIteratorFlow.find(
      (node) =>
        node.data.id === editingIteratorID && isIteratorComponent(node.data)
    ) as Node<IteratorNodeData> | undefined;

    if (targetNodes) {
      const outputOption = availableOutputOptions.find((option) => {
        if (
          targetNodes?.data.iterator_component.output_elements[outputKey] &&
          option.path ===
            targetNodes?.data.iterator_component.output_elements[outputKey]
              .replace("${", "")
              .replace("}", "")
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
          (option) => option.path === value
        );

        if (option) {
          setSelectedOutputOption(option);
          updatePipelineRecipeIsDirty(() => true);
          updateTempSavedNodesForEditingIteratorFlow((nodes) =>
            nodes.map((node) => {
              if (
                node.data.id === editingIteratorID &&
                isIteratorComponent(node.data)
              ) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    iterator_component: {
                      ...node.data.iterator_component,
                      output_elements: {
                        ...node.data.iterator_component.output_elements,
                        [outputKey]: "${" + `${option.path}` + "}",
                      },
                    },
                  },
                };
              }

              return node;
            })
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
          >
            {option.path}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
};
