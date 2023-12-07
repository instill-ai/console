import * as React from "react";
import { Icons } from "@instill-ai/design-system";
import { NodeDropdownMenu } from "./NodeDropdownMenu";
import { ControlPanel } from "./ControlPanel";
import { useInstillStore } from "../../../../lib";

export const StartEndOperatorControlPanel = ({
  nodeIsCollapsed,
  setNodeIsCollapsed,
  handleToggleNote,
  noteIsOpen,
  componentTypeName,
}: {
  nodeIsCollapsed: boolean;
  setNodeIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  handleToggleNote: () => void;
  noteIsOpen: boolean;
  componentTypeName: "End" | "Start";
}) => {
  const [moreOptionsIsOpen, setMoreOptionsIsOpen] = React.useState(false);
  const pipelineIsReadOnly = useInstillStore(
    (store) => store.pipelineIsReadOnly
  );

  return (
    <ControlPanel.Root>
      <ControlPanel.Toggle
        isCollapsed={nodeIsCollapsed}
        onTrigger={() => {
          if (pipelineIsReadOnly) return;

          setNodeIsCollapsed(!nodeIsCollapsed);
        }}
        disabled={pipelineIsReadOnly}
      />
      <NodeDropdownMenu.Root
        isOpen={moreOptionsIsOpen}
        setIsOpen={setMoreOptionsIsOpen}
        componentTypeName={componentTypeName}
      >
        <NodeDropdownMenu.Item
          onClick={(e) => {
            if (pipelineIsReadOnly) return;

            e.stopPropagation();
            handleToggleNote();
            setMoreOptionsIsOpen(false);
          }}
          disabled={pipelineIsReadOnly}
        >
          {noteIsOpen ? (
            <Icons.FileMinus01 className="h-4 w-4 stroke-semantic-fg-secondary" />
          ) : (
            <Icons.FilePlus01 className="h-4 w-4 stroke-semantic-fg-secondary" />
          )}
          <p className="text-semantic-fg-secondary product-body-text-4-medium">
            Toggle note
          </p>
        </NodeDropdownMenu.Item>
      </NodeDropdownMenu.Root>
    </ControlPanel.Root>
  );
};
