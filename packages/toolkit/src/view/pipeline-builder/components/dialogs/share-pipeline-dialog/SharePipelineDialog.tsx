import * as React from "react";
import { Dialog } from "@instill-ai/design-system";

import {
  InstillStore,
  Nullable,
  useInstillStore,
  useShallow,
} from "../../../../../lib";
import { Head } from "./Head";
import { TabShare } from "./TabShare";
import { TabPublish } from "./TabPublish";

const selector = (store: InstillStore) => ({
  dialogSharePipelineIsOpen: store.dialogSharePipelineIsOpen,
  updateDialogSharePipelineIsOpen: store.updateDialogSharePipelineIsOpen,
});

export const SharePipelineDialog = () => {
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
          {selectedTab === "Share" ? <TabShare /> : null}
          {selectedTab === "Publish" ? <TabPublish /> : null}
        </div>
        <Dialog.Close className="!right-6 !top-3" />
      </Dialog.Content>
    </Dialog.Root>
  );
};
