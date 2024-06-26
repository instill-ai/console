"use client";

import * as React from "react";

import { Button, Icons } from "@instill-ai/design-system";

import {
  InstillStore,
  useInstillStore,
  useRouteInfo,
  useShallow,
  useUserPipeline,
} from "../../../../lib";
import { SharePipelineDialog } from "../dialogs";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  updateDialogSharePipelineIsOpen: store.updateDialogSharePipelineIsOpen,
});

export const Share = () => {
  const { accessToken, enabledQuery, updateDialogSharePipelineIsOpen } =
    useInstillStore(useShallow(selector));

  const routeInfo = useRouteInfo();

  const pipeline = useUserPipeline({
    pipelineName: routeInfo.data.pipelineName,
    accessToken,
    enabled: enabledQuery && routeInfo.isSuccess,
  });

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

      {pipeline.isSuccess ? (
        <SharePipelineDialog
          pipelineName={routeInfo.data.pipelineName}
          namespaceId={routeInfo.data.namespaceId}
          id={routeInfo.data.resourceId}
          ownerDisplayName={
            "user" in pipeline.data.owner
              ? pipeline.data.owner.user.profile?.displayName ?? null
              : pipeline.data.owner.organization.profile?.displayName ?? null
          }
        />
      ) : null}
    </React.Fragment>
  );
};
