import { Nullable } from "@instill-ai/toolkit";
import { usePipelineBuilderStore } from "./usePipelineBuilderStore";
import { AIForm } from "./AIForm";
import { BlockchainForm } from "./BlockchainForm";

export type RightPanelProps = {
  accessToken: Nullable<string>;
};

export const RightPanel = (props: RightPanelProps) => {
  const { accessToken } = props;
  const selectedConnectorNode = usePipelineBuilderStore(
    (state) => state.selectedConnectorNode
  );

  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-6 flex w-full items-center justify-center rounded-sm bg-semantic-bg-base-bg">
        <p className="py-2 text-semantic-fg-primary product-body-text-1-semibold">
          Connector Properties
        </p>
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
            ai={{
              id: selectedConnectorNode.data.component.id,
              description:
                selectedConnectorNode.data.component.resource_detail
                  .description,
              configuration: selectedConnectorNode.data.component.configuration,
              connector_definition_name:
                selectedConnectorNode.data.component.definition_name,
            }}
            accessToken={accessToken}
          />
        ) : null}
        {selectedConnectorNode &&
        selectedConnectorNode.data.nodeType === "connector" &&
        selectedConnectorNode.data.component.type ===
          "COMPONENT_TYPE_CONNECTOR_BLOCKCHAIN" ? (
          <BlockchainForm
            blockchain={{
              id: selectedConnectorNode.data.component.id,
              description:
                selectedConnectorNode.data.component.resource_detail
                  .description,
              configuration: selectedConnectorNode.data.component.configuration,
              connector_definition_name:
                selectedConnectorNode.data.component.definition_name,
            }}
            accessToken={accessToken}
          />
        ) : null}
      </div>
    </div>
  );
};
