"use client";

import * as React from "react";
import { Button, Icons } from "@instill-ai/design-system";
import { SharePipelineDialog } from "../dialogs";
import { useInstillStore } from "../../../../lib";

export const Share = () => {
  const updateDialogSharePipelineIsOpen = useInstillStore(
    (store) => store.updateDialogSharePipelineIsOpen
  );

  return (
    <React.Fragment>
      <Button
        size="md"
        variant="tertiaryColour"
        className="flex !h-8 flex-row gap-x-2"
        onClick={() => updateDialogSharePipelineIsOpen((prev) => !prev)}
      >
        Share
        <Icons.Share07 className="my-auto h-4 w-4 stroke-semantic-fg-primary" />
      </Button>
      <SharePipelineDialog />
    </React.Fragment>
  );
};
