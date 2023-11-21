import * as React from "react";
import { Button, Icons, Tooltip } from "@instill-ai/design-system";
import {
  InstillStore,
  Nullable,
  PipelineComponentType,
  useInstillStore,
} from "../../../../lib";
import { NodeDropdownMenu } from "../NodeDropdownMenu";
import { useShallow } from "zustand/react/shallow";

const selector = (store: InstillStore) => ({
  isOwner: store.isOwner,
  currentVersion: store.currentVersion,
});

export const ConnectorNodeControlPanel = ({
  componentType,
  handleDeleteNode,
  handleCopyNode,
  handleEditNode,
  nodeIsCollapsed,
  setNodeIsCollapsed,
  testModeEnabled,
  handleToggleNote,
  noteIsOpen,
}: {
  componentType: PipelineComponentType;
  handleDeleteNode: () => void;
  handleCopyNode: () => void;
  handleEditNode: () => void;
  nodeIsCollapsed: boolean;
  setNodeIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  testModeEnabled: boolean;
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
  }

  return (
    <div className="flex flex-row gap-x-3">
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            {/* 
              eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            */}
            <span className="flex" tabIndex={0}>
              <Button
                className="!my-auto !px-1 !py-1 hover:!bg-semantic-bg-secondary"
                variant="tertiaryGrey"
                size="sm"
                disabled={false}
                onClick={(e) => {
                  e.stopPropagation();
                  setNodeIsCollapsed(!nodeIsCollapsed);
                }}
              >
                {nodeIsCollapsed ? (
                  <Icons.Plus className="h-4 w-4 stroke-semantic-fg-secondary" />
                ) : (
                  <Icons.Minus className="h-4 w-4 stroke-semantic-fg-secondary" />
                )}
              </Button>
            </span>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className="rounded-sm bg-semantic-bg-primary !px-3 !py-2 !product-body-text-4-semibold">
              {`${nodeIsCollapsed ? "Expand" : "Collapse"} component`}
              <Tooltip.Arrow
                className="fill-semantic-bg-primary"
                offset={10}
                width={9}
                height={6}
              />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>

      {/* 
        Control - open right panel
      */}

      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            {/* 
              eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            */}
            <span className="flex" tabIndex={0}>
              <Button
                className="!my-auto !px-1 !py-1 hover:!bg-semantic-bg-secondary"
                variant="tertiaryGrey"
                size="sm"
                disabled={testModeEnabled}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditNode();
                }}
              >
                <Icons.Gear01 className="h-4 w-4 stroke-semantic-fg-secondary" />
              </Button>
            </span>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className="rounded-sm bg-semantic-bg-primary !px-3 !py-2 !product-body-text-4-semibold">
              Open configuration right panel
              <Tooltip.Arrow
                className="fill-semantic-bg-primary"
                offset={10}
                width={9}
                height={6}
              />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>

      {/* 
        Control - more options
      */}

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
    </div>
  );
};
