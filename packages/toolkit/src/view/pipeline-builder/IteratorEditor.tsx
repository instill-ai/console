import * as React from "react";

import { Button, Icons, Select, Separator } from "@instill-ai/design-system";
import {
  InstillStore,
  Nullable,
  PipelineIteratorComponent,
  useInstillStore,
  useShallow,
} from "../../lib";
import { SelectComponentDialog } from "./components";
import {
  composeEdgesFromNodes,
  composePipelineMetadataFromNodes,
  useConstructNodeFromDefinition,
} from "./lib";
import { Node, ReactFlowInstance } from "reactflow";
import { PipelineBuilderCanvas } from "./components/PipelineBuilderCanvas";
import { isIteratorComponent } from "./lib/checkComponentType";
import { ReferenceHintTag } from "../../components";
import { IteratorNodeData } from "./type";

const selector = (store: InstillStore) => ({
  nodes: store.nodes,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
  updateIsEditingIterator: store.updateIsEditingIterator,
  tempSavedNodesForEditingIteratorFlow:
    store.tempSavedNodesForEditingIteratorFlow,
  updateTempSavedNodesForEditingIteratorFlow:
    store.updateTempSavedNodesForEditingIteratorFlow,
  smartHints: store.smartHints,
  editingIteratorID: store.editingIteratorID,
  updateEditingIteratorID: store.updateEditingIteratorID,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
});

type InputOption = {
  path: string;
  instill_format: string;
};

export const IteratorEditor = ({
  reactFlowInstance,
  setReactFlowInstance,
}: {
  reactFlowInstance: Nullable<ReactFlowInstance>;
  setReactFlowInstance: React.Dispatch<
    React.SetStateAction<Nullable<ReactFlowInstance>>
  >;
}) => {
  const [selectDefinitionDialogIsOpen, setSelectDefinitionDialogIsOpen] =
    React.useState(false);
  const {
    nodes,
    updateNodes,
    updateEdges,
    editingIteratorID,
    updateEditingIteratorID,
    updateIsEditingIterator,
    tempSavedNodesForEditingIteratorFlow,
    updateTempSavedNodesForEditingIteratorFlow,
    smartHints,
    updatePipelineRecipeIsDirty,
  } = useInstillStore(useShallow(selector));
  const constructNode = useConstructNodeFromDefinition({ reactFlowInstance });
  const [selectedInputOption, setSelectedInputOption] =
    React.useState<Nullable<InputOption>>(null);

  const availableInputOptions = React.useMemo(() => {
    return smartHints
      .filter((hint) => hint.instillFormat.includes("array:"))
      .map((hint) => ({
        path: hint.path,
        instill_format: hint.instillFormat,
      }));
  }, [smartHints]);

  React.useEffect(() => {
    if (editingIteratorID && tempSavedNodesForEditingIteratorFlow) {
      const targetIteratorNode = tempSavedNodesForEditingIteratorFlow.find(
        (node) =>
          node.data.id === editingIteratorID && isIteratorComponent(node.data)
      ) as Node<IteratorNodeData> | undefined;

      const inputOption = availableInputOptions.find(
        (option) =>
          option.path === targetIteratorNode?.data.iterator_component.input
      );

      if (inputOption) {
        setSelectedInputOption(inputOption);
      }
    }
  }, [
    availableInputOptions,
    editingIteratorID,
    tempSavedNodesForEditingIteratorFlow,
  ]);

  return (
    <div className="flex h-full flex-col bg-semantic-bg-secondary p-4">
      <div className="mb-4 flex flex-row items-center gap-x-1">
        <Button
          onClick={() => {
            updateIsEditingIterator(() => false);
            updateEditingIteratorID(() => null);

            const newNodes = tempSavedNodesForEditingIteratorFlow.map(
              (node) => {
                if (
                  node.data.id === editingIteratorID &&
                  isIteratorComponent(node.data)
                ) {
                  const components = nodes.map((node) => node.data);

                  return {
                    ...node,
                    data: {
                      ...node.data,
                      iterator_component: {
                        ...node.data.iterator_component,
                        components,
                      },
                      metadata: composePipelineMetadataFromNodes(nodes),
                    },
                  };
                }

                return node;
              }
            );

            const newEdges = composeEdgesFromNodes(newNodes);
            updateNodes(() => newNodes);
            updateEdges(() => newEdges);
            updateTempSavedNodesForEditingIteratorFlow(() => []);
          }}
          size="md"
          variant="tertiaryGrey"
        >
          Console
        </Button>
        <Icons.ChevronRight className="h-4 w-4 stroke-semantic-fg-disabled" />
        <Button size="md" variant="secondaryColour">
          Iterator
        </Button>
      </div>
      <Separator className="mb-2" orientation="horizontal" />
      <div className="mb-2 flex flex-col gap-y-2 rounded-sm bg-semantic-bg-primary px-2 py-1">
        <div className="flex flex-col gap-y-1">
          <div className="flex flex-row gap-x-1">
            <p className="text-semantic-fg-secondary product-body-text-4-medium">
              Input
            </p>
          </div>
          <div className="mb-2 flex flex-row items-center gap-x-2">
            <Select.Root
              value={selectedInputOption?.path}
              onValueChange={(value) => {
                const option = availableInputOptions.find(
                  (option) => option.path === value
                );

                if (option) {
                  setSelectedInputOption(option);
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
                              input: option.path,
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
                <Select.Value aria-label={selectedInputOption?.path}>
                  {selectedInputOption ? (
                    <p className="rounded bg-semantic-accent-bg px-2 py-0.5 text-semantic-accent-default product-body-text-4-medium">
                      {"$" + `{${selectedInputOption?.path}}`}
                    </p>
                  ) : null}
                </Select.Value>
              </Select.Trigger>
              <Select.Content viewportClassName="!p-0">
                {availableInputOptions.map((option) => (
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
            <ReferenceHintTag.Root className="!bg-semantic-bg-primary !px-0">
              <ReferenceHintTag.Icon
                type="check"
                className="!stroke-semantic-fg-disabled"
              />
              <ReferenceHintTag.Label
                label="references"
                className="!text-semantic-fg-disabled"
                disabledCopy={true}
                disabledTooltip={true}
              />
            </ReferenceHintTag.Root>

            <div className="flex flex-row gap-x-2">
              <div className="rounded bg-semantic-accent-bg px-2 py-px">
                <p className="font-sans text-[11px] font-medium leading-4 text-semantic-accent-default">
                  element
                </p>
              </div>
              <p className="text-semantic-fg-secondary product-body-text-4-semibold">
                in
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-1">
          <div className="flex flex-row gap-x-1">
            <p className="text-semantic-fg-secondary product-body-text-4-medium">
              Output
            </p>
          </div>
          <div className="flex flex-row gap-x-3">
            <p className="text-semantic-fg-primary product-body-text-3-semibold">
              Result
            </p>
            <div className="flex flex-row gap-x-2">
              <p className="text-semantic-fg-secondary product-body-text-4-semibold">
                array of
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="relative mb-4 flex">
        <Separator orientation="horizontal" className="my-4" />
        <Button
          variant="secondaryGrey"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          onClick={() => setSelectDefinitionDialogIsOpen(true)}
        >
          Add Component
        </Button>
      </div>

      <PipelineBuilderCanvas
        setReactFlowInstance={setReactFlowInstance}
        disabledControls={true}
        disabledMinimap={true}
        disabledBackground={true}
      />

      <SelectComponentDialog
        open={selectDefinitionDialogIsOpen}
        onOpenChange={setSelectDefinitionDialogIsOpen}
        onSelect={(definition, connector) => {
          constructNode(definition, connector);
          setSelectDefinitionDialogIsOpen(false);
        }}
        disabledTrigger={true}
      />
    </div>
  );
};
