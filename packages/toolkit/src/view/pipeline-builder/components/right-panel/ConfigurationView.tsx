import * as React from "react";

import { Button, Icons, Separator } from "@instill-ai/design-system";
import { InstillStore, useInstillStore, useShallow } from "../../../../lib";
import { isGeneralNode } from "../../lib";
import { Node } from "reactflow";
import { GeneralNodeData } from "../../type";
import { PipelineGeneralComponentFormOnRightPanel } from "./PipelineGeneralComponentFormOnRightPanel";

const selector = (store: InstillStore) => ({
  nodes: store.nodes,
  selectedConnectorNodeId: store.selectedConnectorNodeId,
  updateSelectedConnectorNodeId: store.updateSelectedConnectorNodeId,
});

export const ConfigurationView = () => {
  const { nodes, selectedConnectorNodeId, updateSelectedConnectorNodeId } =
    useInstillStore(useShallow(selector));

  const selectedGeneralNode = React.useMemo(() => {
    return nodes.find(
      (node) => node.id === selectedConnectorNodeId && isGeneralNode(node)
    ) as Node<GeneralNodeData> | undefined;
  }, [nodes, selectedConnectorNodeId]);

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto">
      <div className="mb-6 flex w-full flex-row gap-x-1">
        <p className="flex flex-1 items-center justify-center rounded-sm bg-semantic-bg-base-bg py-2 text-semantic-fg-primary product-body-text-1-semibold">
          Connector Properties
        </p>
        <Button
          className="h-10 w-10 !px-0 !py-0"
          variant="secondaryGrey"
          size="md"
          type="button"
          onClick={() => {
            updateSelectedConnectorNodeId(() => null);
          }}
        >
          <Icons.X className="h-4 w-4 stroke-semantic-fg-primary" />
        </Button>
      </div>
      <div className="relative mb-6 w-full">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-semantic-bg-primary px-2">
          <p className="text-semantic-fg-secondary product-body-text-3-medium">
            Configuration
          </p>
        </div>
        <Separator orientation="horizontal" />
      </div>

      {/* 
        We use this additional pb to cope with Browser eaten up parent's padding when it is
        scrollable.
      */}

      <div className="flex w-full pb-10">
        {selectedGeneralNode && selectedGeneralNode.data.definition ? (
          <PipelineGeneralComponentFormOnRightPanel
            nodeData={selectedGeneralNode.data}
            nodeID={selectedGeneralNode.id}
          />
        ) : null}
      </div>
    </div>
  );
};
