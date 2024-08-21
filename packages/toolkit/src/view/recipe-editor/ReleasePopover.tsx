"use client";

import * as React from "react";

import { Button, cn, Icons, Popover } from "@instill-ai/design-system";

import { ReleaseMenu } from "../pipeline-builder";

export const ReleasePopover = () => {
  const [releaseMenuOpen, setReleaseMenuOpen] = React.useState(false);

  return (
    <Popover.Root
      open={releaseMenuOpen}
      onOpenChange={(open) => setReleaseMenuOpen(open)}
    >
      <Popover.Trigger asChild>
        <Button
          size="md"
          variant="secondaryGrey"
          className={cn("flex !h-8 cursor-pointer flex-row gap-x-2")}
        >
          Release
          <Icons.ChevronDown className="h-4 w-4 stroke-semantic-fg-primary" />
        </Button>
      </Popover.Trigger>
      <Popover.Content align="end" className="!w-[392px]">
        <ReleaseMenu
          onRelease={() => {
            setReleaseMenuOpen(false);
          }}
        />
      </Popover.Content>
    </Popover.Root>
  );
};
