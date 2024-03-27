"use client";

import * as React from "react";
import { Button, Icons, Tooltip } from "@instill-ai/design-system";

const ControlPanelRoot = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-row gap-x-3">{children}</div>;
};

const ControlPanelToggle = ({
  isCollapsed,
  onTrigger,
  disabled,
}: {
  isCollapsed: boolean;
  onTrigger: () => void;
  disabled?: boolean;
}) => {
  return (
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
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                onTrigger();
              }}
            >
              {isCollapsed ? (
                <Icons.Plus className="h-4 w-4 stroke-semantic-fg-secondary" />
              ) : (
                <Icons.Minus className="h-4 w-4 stroke-semantic-fg-secondary" />
              )}
            </Button>
          </span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="rounded-sm bg-semantic-bg-primary !px-3 !py-2 !product-body-text-4-semibold">
            {`${isCollapsed ? "Expand" : "Collapse"} component`}
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
  );
};

export const ControlPanel = {
  Root: ControlPanelRoot,
  Toggle: ControlPanelToggle,
};
