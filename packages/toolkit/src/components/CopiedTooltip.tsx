import * as React from "react";

import { Tooltip } from "@instill-ai/design-system";

export function CopiedTooltip({
  children,
  isOpen,
  side,
}: {
  children: React.ReactElement;
  isOpen: boolean;
  side?: "top" | "right" | "bottom" | "left";
}) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root open={isOpen}>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            align="center"
            side={side ?? "top"}
            sideOffset={4}
            className="rounded-sm"
          >
            <div className="px-2.5 py-1.5 rounded-sm bg-semantic-fg-primary text-semantic-bg-primary text-xs font-semibold">
              Copied!
            </div>
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
