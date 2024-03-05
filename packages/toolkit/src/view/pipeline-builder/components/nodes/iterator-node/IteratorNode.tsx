import * as React from "react";
import { NodeProps } from "reactflow";
import { IteratorNodeData } from "../../../type";
import { NodeHead, NodeIDEditor, NodeWrapper } from "../common";
import { ImageWithFallback } from "../../../../../components";
import { Button, Icons } from "@instill-ai/design-system";
import { ConnectorOperatorControlPanel } from "../control-panel";

export const IteratorNode = ({ data, id }: NodeProps<IteratorNodeData>) => {
  const [noteIsOpen, setNoteIsOpen] = React.useState(false);
  const [nodeIsCollapsed, setNodeIsCollapsed] = React.useState(false);

  return (
    <NodeWrapper nodeData={data} noteIsOpen={noteIsOpen}>
      <NodeHead nodeIsCollapsed={nodeIsCollapsed}>
        <div className="mr-auto flex flex-row gap-x-1">
          <ImageWithFallback
            src="/icons/iterator.svg"
            width={16}
            height={16}
            alt="iterator-icon"
            fallbackImg={
              <Icons.Box className="my-auto h-4 w-4 stroke-semantic-fg-primary" />
            }
          />
          <NodeIDEditor currentNodeID={id} />
        </div>
        <ConnectorOperatorControlPanel
          nodeID={id}
          nodeData={data}
          nodeIsCollapsed={nodeIsCollapsed}
          setNodeIsCollapsed={setNodeIsCollapsed}
          handleToggleNote={() => setNoteIsOpen((prev) => !prev)}
          noteIsOpen={noteIsOpen}
        />
      </NodeHead>
      {nodeIsCollapsed ? null : (
        <React.Fragment>
          <div className="mb-2 flex flex-col gap-y-2">
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-row">
                <p className="text-semantic-fg-secondary product-body-text-4-medium">
                  Iteration Input
                </p>
              </div>
              <div className="w-full rounded-sm border border-semantic-bg-line bg-semantic-bg-primary px-[9px] py-1.5"></div>
            </div>
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-row">
                <p className="text-semantic-fg-secondary product-body-text-4-medium">
                  Iteration components
                </p>
              </div>
            </div>
          </div>
          <Button variant="tertiaryColour" className="w-full">
            Edit Iterator
          </Button>
        </React.Fragment>
      )}
    </NodeWrapper>
  );
};
