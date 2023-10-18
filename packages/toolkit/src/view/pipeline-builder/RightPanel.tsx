import {
  PipelineBuilderStore,
  usePipelineBuilderStore,
} from "./usePipelineBuilderStore";
import { shallow } from "zustand/shallow";
import { Button, Icons, Separator } from "@instill-ai/design-system";
import { AIForm } from "../ai";
import { BlockchainForm } from "../blockchain";
import { DataComponentForm } from "../data";

const pipelineBuilderSelector = (state: PipelineBuilderStore) => ({
  nodes: state.nodes,
  selectedConnectorNodeId: state.selectedConnectorNodeId,
  updateSelectedConnectorNodeId: state.updateSelectedConnectorNodeId,
});

export const RightPanel = () => {
  const { nodes, selectedConnectorNodeId, updateSelectedConnectorNodeId } =
    usePipelineBuilderStore(pipelineBuilderSelector, shallow);

  const selectedConnectorNode = nodes.find(
    (node) => node.id === selectedConnectorNodeId
  );

  return (
    <div className="flex h-full w-full flex-col">
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
            Configration
          </p>
        </div>
        <Separator orientation="horizontal" />
      </div>

      {/* 
        We use this additional pb to cope with Browser eaten up parent's padding when it is
        scrollable.
      */}

      <div className="flex w-full pb-10">
        {selectedConnectorNode &&
        selectedConnectorNode.data.nodeType === "connector" &&
        selectedConnectorNode.data.component.type ===
          "COMPONENT_TYPE_CONNECTOR_AI" ? (
          <AIForm
            connectorDefinitionName={
              selectedConnectorNode.data.component.definition_name
            }
            configuration={selectedConnectorNode.data.component.configuration}
          />
        ) : null}
        {selectedConnectorNode &&
        selectedConnectorNode.data.nodeType === "connector" &&
        selectedConnectorNode.data.component.type ===
          "COMPONENT_TYPE_CONNECTOR_BLOCKCHAIN" ? (
          <BlockchainForm
            configuration={selectedConnectorNode.data.component.configuration}
          />
        ) : null}
        {selectedConnectorNode &&
        selectedConnectorNode.data.nodeType === "connector" &&
        selectedConnectorNode.data.component.type ===
          "COMPONENT_TYPE_CONNECTOR_DATA" ? (
          selectedConnectorNode.data.component.definition_name ===
            "connector-definitions/data-pinecone" ||
          selectedConnectorNode.data.component.definition_name ===
            "connector-definitions/data-gcs" ? (
            <DataComponentForm
              connectorDefinitionName={
                selectedConnectorNode.data.component.definition_name
              }
              configuration={selectedConnectorNode.data.component.configuration}
            />
          ) : null
        ) : null}
      </div>
    </div>
  );
};
