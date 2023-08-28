import { ImageWithFallback, Nullable } from "@instill-ai/toolkit";
import {
  PipelineBuilderStore,
  usePipelineBuilderStore,
} from "./usePipelineBuilderStore";
import { AIForm } from "./AIForm";
import { BlockchainForm } from "./BlockchainForm";
import { shallow } from "zustand/shallow";
import { Icons, Separator } from "@instill-ai/design-system";

export type RightPanelProps = {
  accessToken: Nullable<string>;
};

const pipelineBuilderSelector = (state: PipelineBuilderStore) => ({
  nodes: state.nodes,
  selectedConnectorNodeId: state.selectedConnectorNodeId,
});

export const RightPanel = (props: RightPanelProps) => {
  const { nodes, selectedConnectorNodeId } = usePipelineBuilderStore(
    pipelineBuilderSelector,
    shallow
  );

  const selectedConnectorNode = nodes.find(
    (node) => node.id === selectedConnectorNodeId
  );

  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-6 flex w-full items-center justify-center rounded-sm bg-semantic-bg-base-bg">
        <p className="py-2 text-semantic-fg-primary product-body-text-1-semibold">
          Connector Properties
        </p>
      </div>
      {selectedConnectorNode ? (
        <div className="mb-5 flex w-full flex-row gap-x-6">
          <div className="my-auto text-semantic-fg-primary product-body-text-2-semibold">
            Resource
          </div>
          <div className="flex flex-row gap-x-2 p-2">
            <div className="flex flex-row gap-x-1">
              <div className="p-2.5">
                <ImageWithFallback
                  src={`/icons/${selectedConnectorNode.data.component?.definition_detail?.vendor}/${selectedConnectorNode.data.component?.definition_detail?.icon}`}
                  width={16}
                  height={15}
                  alt={`${selectedConnectorNode.data.component?.definition_detail?.title}-icon`}
                  fallbackImg={
                    <Icons.Box className="h-8 w-8 stroke-semantic-fg-primary" />
                  }
                />
              </div>
              <p className="my-auto w-[200px] truncate text-semantic-fg-primary product-headings-heading-5">
                {
                  selectedConnectorNode.data.component?.resource_name.split(
                    "/"
                  )[1]
                }
              </p>
            </div>
            <Icons.Check className="my-auto h-5 w-5 stroke-semantic-fg-primary" />
          </div>
        </div>
      ) : null}
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
            connector_definition_name={
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
      </div>
    </div>
  );
};
