"use client";

import * as React from "react";

import { Button, cn, Icons, Popover } from "@instill-ai/design-system";

import { useInstillStore } from "../../../../lib";
import { ReleaseMenu } from "../release-menu";

export const Release = () => {
  const [releaseMenuOpen, setReleaseMenuOpen] = React.useState(false);
  const pipelineRecipeIsDirty = useInstillStore(
    (store) => store.pipelineRecipeIsDirty,
  );

  return (
    <Popover.Root
      open={releaseMenuOpen}
      onOpenChange={(open) => setReleaseMenuOpen(open)}
    >
      <Popover.Trigger asChild>
        <Button
          size="md"
          variant="primary"
          className={cn(
            "flex !h-8 cursor-pointer flex-row gap-x-2",
            pipelineRecipeIsDirty
              ? ""
              : "!bg-semantic-accent-default !text-semantic-fg-on-default hover:!bg-semantic-accent-hover active:!bg-semantic-accent-pressed",
          )}
        >
          Release
          <Icons.ChevronDown className="h-4 w-4 stroke-semantic-fg-on-default" />
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
