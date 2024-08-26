"use client";

import * as React from "react";
import { Nullable } from "instill-sdk";

import { Button, Dialog, Icons } from "@instill-ai/design-system";

import {
  InstillStore,
  useInstillStore,
  useNamespacePipeline,
  useRouteInfo,
  useShallow,
} from "../../../../lib";
import { Head } from "./Head";
import { TabPublish } from "./TabPublish";
import { TabShare } from "./TabShare";

const selector = (store: InstillStore) => ({
  dialogSharePipelineIsOpen: store.dialogSharePipelineIsOpen,
  updateDialogSharePipelineIsOpen: store.updateDialogSharePipelineIsOpen,
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const SharePipelineDialog = () => {
  const [selectedTab, setSelectedTab] =
    React.useState<Nullable<string>>("Share");

  const {
    accessToken,
    enabledQuery,
    dialogSharePipelineIsOpen,
    updateDialogSharePipelineIsOpen,
  } = useInstillStore(useShallow(selector));

  const routeInfo = useRouteInfo();

  const pipeline = useNamespacePipeline({
    namespacePipelineName: routeInfo.data.pipelineName,
    accessToken,
    enabled: enabledQuery && routeInfo.isSuccess,
  });

  const ownerDisplayName = React.useMemo(() => {
    if (!pipeline.isSuccess) {
      return null;
    }

    return "user" in pipeline.data.owner
      ? (pipeline.data.owner.user.profile?.displayName ?? null)
      : (pipeline.data.owner.organization.profile?.displayName ?? null);
  }, [pipeline.data, pipeline.isSuccess]);

  return (
    <Dialog.Root
      open={dialogSharePipelineIsOpen}
      onOpenChange={(open) => updateDialogSharePipelineIsOpen(() => open)}
    >
      <Button
        size="md"
        variant="tertiaryGrey"
        className="p-[9px] my-auto"
        onClick={() => updateDialogSharePipelineIsOpen((prev) => !prev)}
      >
        <Icons.Share07 className="my-auto h-[14px] w-[14px] stroke-semantic-fg-primary" />
      </Button>
      <Dialog.Content className="!w-[480px] !p-0">
        <div className="flex w-full flex-col">
          <Head selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
          {selectedTab === "Share" ? (
            <TabShare
              id={pipeline.data?.id ?? null}
              pipelineName={pipeline.data?.name ?? null}
              namespaceId={routeInfo.data.namespaceId}
              ownerDisplayName={ownerDisplayName}
            />
          ) : null}
          {selectedTab === "Publish" ? (
            <TabPublish pipelineName={pipeline.data?.name ?? null} />
          ) : null}
        </div>
        <Dialog.Close className="!right-6 !top-3" />
      </Dialog.Content>
    </Dialog.Root>
  );
};
