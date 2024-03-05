import * as React from "react";

import { Button, Icons, Separator } from "@instill-ai/design-system";
import { InstillStore, Nullable, useInstillStore, useShallow } from "../../lib";
import { SelectComponentDialog } from "./components";
import { useConstructNodeFromDefinition } from "./lib";
import { ReactFlowInstance } from "reactflow";
import { PipelineBuilderCanvas } from "./components/PipelineBuilderCanvas";

const selector = (store: InstillStore) => ({
  updateCurrentEditingIterator: store.updateCurrentEditingIterator,
  updateIsEditingIterator: store.updateIsEditingIterator,
});

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
  const { updateCurrentEditingIterator, updateIsEditingIterator } =
    useInstillStore(useShallow(selector));
  const constructNode = useConstructNodeFromDefinition({ reactFlowInstance });

  return (
    <div className="flex h-full flex-col bg-semantic-bg-secondary p-4">
      <div className="mb-4 flex flex-row items-center gap-x-1">
        <Button
          onClick={() => {
            updateIsEditingIterator(() => false);
            updateCurrentEditingIterator(() => null);
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
      <div className="mb-2 flex flex-col gap-y-2">
        <div className="h-[160px] w-full rounded-sm bg-semantic-bg-primary"></div>
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

      <PipelineBuilderCanvas setReactFlowInstance={setReactFlowInstance} />

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
