import * as React from "react";
import { Icons } from "@instill-ai/design-system";
import { NodeDropdownMenu } from "./NodeDropdownMenu";
import { ControlPanel } from "./ControlPanel";

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

  return (
    <ControlPanel.Root>
      <ControlPanel.Toggle
        isCollapsed={nodeIsCollapsed}
        onTrigger={() => {
          setNodeIsCollapsed(!nodeIsCollapsed);
        }}
      />
      <NodeDropdownMenu.Root
        isOpen={moreOptionsIsOpen}
        setIsOpen={setMoreOptionsIsOpen}
        componentTypeName={componentTypeName}
      >
        <NodeDropdownMenu.Item
          onClick={(e) => {
            e.stopPropagation();
            handleToggleNote();
            setMoreOptionsIsOpen(false);
          }}
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
