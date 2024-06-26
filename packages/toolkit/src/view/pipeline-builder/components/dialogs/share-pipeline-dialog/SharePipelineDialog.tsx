"use client";

import * as React from "react";

import { Dialog } from "@instill-ai/design-system";

import {
  InstillStore,
  Nullable,
  useInstillStore,
  useShallow,
} from "../../../../../lib";
import { Head } from "./Head";
import { TabPublish } from "./TabPublish";
import { TabShare } from "./TabShare";

const selector = (store: InstillStore) => ({
  dialogSharePipelineIsOpen: store.dialogSharePipelineIsOpen,
  updateDialogSharePipelineIsOpen: store.updateDialogSharePipelineIsOpen,
});

export const SharePipelineDialog = ({
  pipelineName,
  namespaceId,
  id,
  ownerDisplayName,
}: {
  pipelineName: Nullable<string>;
  namespaceId: Nullable<string>;
  id: Nullable<string>;
  ownerDisplayName: Nullable<string>;
}) => {
  const [selectedTab, setSelectedTab] =
    React.useState<Nullable<string>>("Share");

  const { dialogSharePipelineIsOpen, updateDialogSharePipelineIsOpen } =
    useInstillStore(useShallow(selector));

  return (
    <Dialog.Root
      open={dialogSharePipelineIsOpen}
      onOpenChange={(open) => updateDialogSharePipelineIsOpen(() => open)}
    >
      <Dialog.Content className="!w-[480px] !p-0">
        <div className="flex w-full flex-col">
          <Head selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
          {selectedTab === "Share" ? (
            <TabShare
              pipelineName={pipelineName}
              namespaceId={namespaceId}
              id={id}
              ownerDisplayName={ownerDisplayName}
            />
          ) : null}
          {selectedTab === "Publish" ? (
            <TabPublish pipelineName={pipelineName} />
          ) : null}
        </div>
        <Dialog.Close className="!right-6 !top-3" />
      </Dialog.Content>
    </Dialog.Root>
  );
};
