import * as React from "react";
import { Button, Icons, Popover, Tooltip } from "@instill-ai/design-system";
import { Nullable, PipelineComponentType } from "../../../../lib";

export const ConnectorNodeControlPanel = ({
  componentType,
  handleDeleteNode,
  handleCopyNode,
  handleEditNode,
  testModeEnabled,
}: {
  componentType: PipelineComponentType;
  handleDeleteNode: () => void;
  handleCopyNode: () => void;
  handleEditNode: () => void;
  testModeEnabled: boolean;
}) => {
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
      componentTypeName = "Operator";
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
                className="!px-1 !py-1 !my-auto hover:!bg-semantic-bg-secondary"
                variant="tertiaryGrey"
                size="sm"
                disabled={testModeEnabled}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditNode();
                }}
              >
                <Icons.Gear01 className="w-4 h-4 stroke-semantic-fg-secondary" />
              </Button>
            </span>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content className="!px-3 !py-2 rounded-sm !product-body-text-4-semibold bg-semantic-bg-primary">
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
      <Popover.Root
        open={moreOptionsIsOpen}
        onOpenChange={(open) => setMoreOptionsIsOpen(open)}
      >
        <Popover.Trigger>
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                {/* 
                  eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                */}
                <span className="flex" tabIndex={0}>
                  <Button
                    className="!px-1 !py-1 !my-auto hover:!bg-semantic-bg-secondary"
                    size="sm"
                    variant="tertiaryGrey"
                    type="button"
                    onClick={() => {
                      setMoreOptionsIsOpen(!moreOptionsIsOpen);
                    }}
                  >
                    <Icons.DotsHorizontal className="w-4 h-4 stroke-semantic-fg-secondary" />
                  </Button>
                </span>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="!px-3 !py-2 rounded-sm !product-body-text-4-semibold bg-semantic-bg-primary">
                  More control options
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
        </Popover.Trigger>

        <Popover.Content
          side="bottom"
          sideOffset={4}
          align="start"
          className="w-[200px] !p-0 flex flex-col !rounded-sm !border !border-semantic-bg-line"
        >
          <div className="h-6 px-2 flex bg-semantic-bg-base-bg gap-x-3 rounded-t-sm border-b border-semantic-bg-line">
            {componentTypeName ? (
              <p className="my-auto text-semantic-fg-disabled text-[10px] font-semibold">
                {componentTypeName}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col py-2 gap-y-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopyNode();
                setMoreOptionsIsOpen(false);
              }}
              className="flex flex-row py-1 px-2 gap-x-2 hover:bg-semantic-bg-base-bg"
            >
              <Icons.Copy07 className="w-4 h-4 stroke-semantic-fg-secondary" />
              <p className="product-body-text-4-medium text-semantic-fg-secondary">
                Duplicate
              </p>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteNode();
                setMoreOptionsIsOpen(false);
              }}
              className="flex flex-row py-1 px-2 gap-x-2 hover:bg-semantic-bg-base-bg"
            >
              <Icons.Trash01 className="w-4 h-4 stroke-semantic-error-default" />
              <p className="product-body-text-4-medium text-semantic-error-default">
                Delete
              </p>
            </button>
          </div>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
};
