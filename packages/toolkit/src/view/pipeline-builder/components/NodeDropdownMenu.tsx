import * as React from "react";

import { Button, Icons, Popover, Tooltip } from "@instill-ai/design-system";
import { InstillStore, Nullable, useInstillStore } from "../../../lib";
import { useShallow } from "zustand/react/shallow";

const selector = (store: InstillStore) => ({
  testModeEnabled: store.testModeEnabled,
});

const NodeDropdownMenuRoot = ({
  componentTypeName,
  children,
  isOpen,
  setIsOpen,
}: {
  componentTypeName: Nullable<string>;
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { testModeEnabled } = useInstillStore(useShallow(selector));

  return (
    <Popover.Root open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Popover.Trigger>
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              {/* 
                eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
              */}
              <span className="flex" tabIndex={0}>
                <Button
                  className="!my-auto !px-1 !py-1 hover:!bg-semantic-bg-secondary"
                  size="sm"
                  variant="tertiaryGrey"
                  type="button"
                  disabled={testModeEnabled}
                  onClick={() => {
                    setIsOpen(!isOpen);
                  }}
                >
                  <Icons.DotsHorizontal className="h-4 w-4 stroke-semantic-fg-secondary" />
                </Button>
              </span>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="rounded-sm bg-semantic-bg-primary !px-3 !py-2 !product-body-text-4-semibold">
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
        className="flex w-[200px] flex-col !rounded-sm !border !border-semantic-bg-line !p-0"
      >
        <div className="flex h-6 gap-x-3 rounded-t-sm border-b border-semantic-bg-line bg-semantic-bg-base-bg px-2">
          {componentTypeName ? (
            <p className="my-auto text-[10px] font-semibold text-semantic-fg-disabled">
              {componentTypeName}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-y-1 py-2">{children}</div>
      </Popover.Content>
    </Popover.Root>
  );
};

const NodeDropdownMenuItem = (
  props: {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    children: React.ReactNode;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
) => {
  const { onClick, children, ...passThrough } = props;

  return (
    <button
      {...passThrough}
      onClick={onClick}
      className="flex flex-row gap-x-2 px-2 py-1 hover:bg-semantic-bg-base-bg"
    >
      {children}
    </button>
  );
};

export const NodeDropdownMenu = {
  Root: NodeDropdownMenuRoot,
  Item: NodeDropdownMenuItem,
};
