import * as React from "react";
import { Dialog } from "@instill-ai/design-system";
import { useRouter } from "next/router";

import {
  InstillStore,
  Nullable,
  useInstillStore,
  useShallow,
  useUserPipeline,
} from "../../../../../lib";
import { Head } from "./Head";
import { TabShare } from "./TabShare";
import { TabPublish } from "./TabPublish";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  dialogSharePipelineIsOpen: store.dialogSharePipelineIsOpen,
  updateDialogSharePipelineIsOpen: store.updateDialogSharePipelineIsOpen,
  pipelineIsNew: store.pipelineIsNew,
});

export const SharePipelineDialog = () => {
  const [selectedTab, setSelectedTab] =
    React.useState<Nullable<string>>("Share");

  const router = useRouter();
  const { id, entity } = router.query;

  const {
    accessToken,
    enabledQuery,
    dialogSharePipelineIsOpen,
    updateDialogSharePipelineIsOpen,
    pipelineIsNew,
  } = useInstillStore(useShallow(selector));

  const pipeline = useUserPipeline({
    pipelineName: `users/${entity}/pipelines/${id}`,
    accessToken,
    enabled: enabledQuery && !!accessToken && !pipelineIsNew,
  });

  const pipelineIsPublic = React.useMemo(() => {
    if (!pipeline.isSuccess) {
      return false;
    }

    const toplevelRule = pipeline.data.permission.users["users/*"];

    if (toplevelRule && toplevelRule.enabled) {
      return true;
    } else {
      return false;
    }
  }, [pipeline.data, pipeline.isSuccess]);

  const enableShareCode = React.useMemo(() => {
    if (!pipeline.isSuccess) {
      return false;
    }

    const toplevelRule = pipeline.data.permission.share_code;

    if (toplevelRule && toplevelRule.enabled) {
      return true;
    } else {
      return false;
    }
  }, [pipeline.isSuccess, pipeline.data]);

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
