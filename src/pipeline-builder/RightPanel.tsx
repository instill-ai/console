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
        selectedConnectorNode.data.connector.connector_type ===
          "CONNECTOR_TYPE_AI" ? (
          <AIForm
            ai={selectedConnectorNode.data.connector}
            accessToken={accessToken}
          />
        ) : null}
        {selectedConnectorNode &&
        selectedConnectorNode.data.nodeType === "connector" &&
        selectedConnectorNode.data.connector.connector_type ===
          "CONNECTOR_TYPE_BLOCKCHAIN" ? (
          <BlockchainForm
            blockchain={selectedConnectorNode.data.connector}
            accessToken={accessToken}
          />
        ) : null}
      </div>
    </div>
  );
};
