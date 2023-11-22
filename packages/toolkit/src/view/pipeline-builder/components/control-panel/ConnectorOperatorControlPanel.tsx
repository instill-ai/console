import * as React from "react";
import { Icons } from "@instill-ai/design-system";
import {
  InstillStore,
  Nullable,
  PipelineComponentType,
  useInstillStore,
} from "../../../../lib";
import { NodeDropdownMenu } from "../NodeDropdownMenu";
import { useShallow } from "zustand/react/shallow";
import { ControlPanel } from "./ControlPanel";

const selector = (store: InstillStore) => ({
  isOwner: store.isOwner,
  currentVersion: store.currentVersion,
});

export const ConnectorOperatorControlPanel = ({
  componentType,
  handleDeleteNode,
  handleCopyNode,
  handleEditNode,
  nodeIsCollapsed,
  setNodeIsCollapsed,
  handleToggleNote,
  noteIsOpen,
}: {
  componentType: PipelineComponentType;
  handleDeleteNode: () => void;
  handleCopyNode: () => void;
  handleEditNode: () => void;
  nodeIsCollapsed: boolean;
  setNodeIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  handleToggleNote: () => void;
  noteIsOpen: boolean;
}) => {
  const { isOwner, currentVersion } = useInstillStore(useShallow(selector));

  const [moreOptionsIsOpen, setMoreOptionsIsOpen] = React.useState(false);

  let componentTypeName: Nullable<string> = null;

  switch (componentType) {
    case "COMPONENT_TYPE_CONNECTOR_AI":
      componentTypeName = "AI Component";
      break;
    case "COMPONENT_TYPE_CONNECTOR_DATA":
      componentTypeName = "Data Component";
      break;
    case "COMPONENT_TYPE_CONNECTOR_BLOCKCHAIN":
      componentTypeName = "Blockchain Component";
      break;
    case "COMPONENT_TYPE_OPERATOR":
      componentTypeName = "Operator Component";
      break;
  }

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
        <NodeDropdownMenu.Item
          onClick={(e) => {
            e.stopPropagation();
            handleCopyNode();
            setMoreOptionsIsOpen(false);
          }}
          disabled={!isOwner || currentVersion !== "latest"}
        >
          <Icons.Copy07 className="h-4 w-4 stroke-semantic-fg-secondary" />
          <p className="text-semantic-fg-secondary product-body-text-4-medium">
            Duplicate
          </p>
        </NodeDropdownMenu.Item>
        <NodeDropdownMenu.Item
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteNode();
            setMoreOptionsIsOpen(false);
          }}
          disabled={!isOwner || currentVersion !== "latest"}
        >
          <Icons.Trash01 className="h-4 w-4 stroke-semantic-error-default" />
          <p className="text-semantic-error-default product-body-text-4-medium">
            Delete
          </p>
        </NodeDropdownMenu.Item>
      </NodeDropdownMenu.Root>
    </ControlPanel.Root>
  );
};
