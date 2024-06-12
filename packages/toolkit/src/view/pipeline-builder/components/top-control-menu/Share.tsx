"use client";

import * as React from "react";
import { Button, Icons } from "@instill-ai/design-system";
import { SharePipelineDialog } from "../dialogs";
import { useRouteInfo, useInstillStore } from "../../../../lib";

export const Share = () => {
  const updateDialogSharePipelineIsOpen = useInstillStore(
    (store) => store.updateDialogSharePipelineIsOpen
  );

  const routeInfo = useRouteInfo();

  return (
    <React.Fragment>
      <Button
        size="md"
        variant="tertiaryGrey"
        className="flex !h-8 flex-row gap-x-2"
        onClick={() => updateDialogSharePipelineIsOpen((prev) => !prev)}
      >
        Share
        <Icons.Share07 className="my-auto h-4 w-4 stroke-semantic-fg-primary" />
      </Button>
      <SharePipelineDialog
        pipelineName={routeInfo.data.pipelineName}
        entity={routeInfo.data.namespaceId}
        id={routeInfo.data.resourceId}
      />
    </React.Fragment>
  );
};
