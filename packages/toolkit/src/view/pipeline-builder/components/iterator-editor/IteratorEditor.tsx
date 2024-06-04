"use client";

import * as React from "react";

import { Button, Icons, Separator } from "@instill-ai/design-system";
import {
  InstillStore,
  Nullable,
  PipelineComponent,
  useInstillStore,
  useShallow,
} from "../../../../lib";
import { SelectComponentDialog } from "..";
import {
  composeEdgesFromNodes,
  composePipelineMetadataMapFromNodes,
  isIteratorNode,
  isResponseNode,
  isVariableNode,
  useAddNodeWithDefinition,
} from "../../lib";
import { ReactFlowInstance } from "reactflow";
import { PipelineBuilderCanvas } from "../PipelineBuilderCanvas";
import { IteratorInput } from "./iterator-input/IteratorInput";
import { IteratorOutput } from "./iterator-output/IteratorOutput";

const selector = (store: InstillStore) => ({
  nodes: store.nodes,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
  updateIsEditingIterator: store.updateIsEditingIterator,
  tempSavedNodesForEditingIteratorFlow:
    store.tempSavedNodesForEditingIteratorFlow,
  updateTempSavedNodesForEditingIteratorFlow:
    store.updateTempSavedNodesForEditingIteratorFlow,
  editingIteratorID: store.editingIteratorID,
  updateEditingIteratorID: store.updateEditingIteratorID,
});

export type InOutputOption = {
  path: string;
  instillFormat: string;
  description?: string;
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
  } = useInstillStore(useShallow(selector));

  const addNode = useAddNodeWithDefinition({ reactFlowInstance });

  return (
    <div className="flex h-full flex-col bg-semantic-bg-secondary p-4">
      <div className="mb-4 flex flex-row items-center gap-x-1">
        <Button
          onClick={() => {
            const newNodes = tempSavedNodesForEditingIteratorFlow.map(
              (node) => {
                if (node.id === editingIteratorID && isIteratorNode(node)) {
                  const components = nodes
                    .filter(
                      (node) => !isVariableNode(node) || !isResponseNode(node)
                    )
                    .map((node) => node.data) as PipelineComponent[];

                  return {
                    ...node,
                    data: {
                      ...node.data,
                      components,
                      metadata: composePipelineMetadataMapFromNodes(nodes),
                    },
                  };
                }

                return node;
              }
            );

            const newEdges = composeEdgesFromNodes(newNodes);

            updateNodes(() => newNodes);
            updateEdges(() => newEdges);
            updateIsEditingIterator(() => false);
            updateEditingIteratorID(() => null);
            updateTempSavedNodesForEditingIteratorFlow(() => []);
          }}
          size="md"
          variant="tertiaryGrey"
        >
          Console
        </Button>
        <Icons.ChevronRight className="h-4 w-4 stroke-semantic-fg-disabled" />
        <Button size="md" variant="secondaryColour">
          {editingIteratorID}
        </Button>
      </div>
      <Separator className="mb-2" orientation="horizontal" />
      <div className="mb-2 flex flex-col gap-y-2 rounded-sm bg-semantic-bg-primary px-2 py-1">
        <div className="flex flex-col gap-y-2">
          <IteratorInput />
          <IteratorOutput />
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
        onSelect={(definition) => {
          addNode(definition);
          setSelectDefinitionDialogIsOpen(false);
        }}
        disabledTrigger={true}
      />
    </div>
  );
};
