"use client";

import * as React from "react";

import { Button, Icons } from "@instill-ai/design-system";

import {
  InstillStore,
  useInstillStore,
  useNamespacePipeline,
  useRouteInfo,
  useShallow,
} from "../../lib";
import { SharePipelineDialog } from "../pipeline-builder";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  updateDialogSharePipelineIsOpen: store.updateDialogSharePipelineIsOpen,
});

export const ShareDialogTrigger = () => {
  const { accessToken, enabledQuery, updateDialogSharePipelineIsOpen } =
    useInstillStore(useShallow(selector));

  const routeInfo = useRouteInfo();

  const pipeline = useNamespacePipeline({
    namespacePipelineName: routeInfo.data.pipelineName,
    accessToken,
    enabled: enabledQuery && routeInfo.isSuccess,
  });

  return (
    <React.Fragment>
      <Button
        size="md"
        variant="tertiaryGrey"
        className="p-[9px] my-auto"
        onClick={() => updateDialogSharePipelineIsOpen((prev) => !prev)}
      >
        <Icons.Share07 className="my-auto h-[14px] w-[14px] stroke-semantic-fg-primary" />
      </Button>

      {pipeline.isSuccess ? (
        <SharePipelineDialog
          pipelineName={routeInfo.data.pipelineName}
          namespaceId={routeInfo.data.namespaceId}
          id={routeInfo.data.resourceId}
          ownerDisplayName={
            "user" in pipeline.data.owner
              ? (pipeline.data.owner.user.profile?.displayName ?? null)
              : (pipeline.data.owner.organization.profile?.displayName ?? null)
          }
        />
      ) : null}
    </React.Fragment>
  );
};
