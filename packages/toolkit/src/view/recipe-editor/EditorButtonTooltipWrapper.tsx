"use client";

import * as React from "react";

import { Tooltip } from "@instill-ai/design-system";

export const EditorButtonTooltipWrapper = ({
  children,
  tooltipContent,
}: {
  children: React.ReactNode;
  tooltipContent: string;
}) => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          {/* 
            eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          */}
          <span className="flex" tabIndex={0}>
            {children}
          </span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="rounded-sm !bg-semantic-bg-secondary-base-bg !text-semantic-bg-primary !px-3 !py-2 !product-body-text-4-semibold">
            {tooltipContent}
            <Tooltip.Arrow
              className="fill-semantic-bg-secondary-base-bg"
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
