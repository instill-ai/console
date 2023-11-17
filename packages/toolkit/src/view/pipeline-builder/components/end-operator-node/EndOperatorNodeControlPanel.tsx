import * as React from "react";
import { Button, Icons, Tooltip } from "@instill-ai/design-system";
import { NodeDropdownMenu } from "../NodeDropdownMenu";

export const EndOperatorNodeControlPanel = ({
  nodeIsCollapsed,
  setNodeIsCollapsed,
}: {
  nodeIsCollapsed: boolean;
  setNodeIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [moreOptionsIsOpen, setMoreOptionsIsOpen] = React.useState(false);

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
        Control - more options
      */}

      <NodeDropdownMenu
        isOpen={moreOptionsIsOpen}
        setIsOpen={setMoreOptionsIsOpen}
        componentTypeName="End"
      ></NodeDropdownMenu>
    </div>
  );
};
