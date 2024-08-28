"use client";

import * as React from "react";

import { Button, Icons, Popover } from "@instill-ai/design-system";

import { ReleaseMenu } from "../../pipeline-builder";
import { EditorButtonTooltipWrapper } from "../EditorButtonTooltipWrapper";

export const ReleasePopover = () => {
  const [releaseMenuOpen, setReleaseMenuOpen] = React.useState(false);

  return (
    <Popover.Root
      open={releaseMenuOpen}
      onOpenChange={(open) => setReleaseMenuOpen(open)}
    >
      <EditorButtonTooltipWrapper tooltipContent="Release">
        <Popover.Anchor asChild>
          <Button
            size="md"
            variant="tertiaryGrey"
            onClick={() => setReleaseMenuOpen((prev) => !prev)}
            className="flex !p-[9px] my-auto"
          >
            <Icons.Rocket02 className="h-[14px] w-[14px] stroke-semantic-fg-primary" />
          </Button>
        </Popover.Anchor>
      </EditorButtonTooltipWrapper>
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
