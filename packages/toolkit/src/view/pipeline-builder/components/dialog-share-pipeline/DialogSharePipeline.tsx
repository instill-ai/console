import cn from "clsx";
import {
  Button,
  Dialog,
  Icons,
  Switch,
  Tooltip,
  useToast,
} from "@instill-ai/design-system";
import * as React from "react";
import {
  InstillStore,
  Nullable,
  UpdateUserPipelinePayload,
  env,
  getInstillApiErrorMessage,
  useInstillStore,
  useShallow,
  useUpdateUserPipeline,
  useUserPipeline,
} from "../../../../lib";
import { useRouter } from "next/router";
import { isAxiosError } from "axios";
import { LoadingSpin } from "../../../../components";
import { Head } from "./Head";
import { TabShare } from "./TabShare";
import { TabPublish } from "./TabPublish";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enableQuery: store.enabledQuery,
  dialogSharePipelineIsOpen: store.dialogSharePipelineIsOpen,
  updateDialogSharePipelineIsOpen: store.updateDialogSharePipelineIsOpen,
  pipelineIsNew: store.pipelineIsNew,
});

export const DialogSharePipeline = () => {
  const [selectedTab, setSelectedTab] =
    React.useState<Nullable<string>>("Share");

  const [copied, setCopied] = React.useState(false);
  const router = useRouter();
  const { id, entity } = router.query;
  const [isUpdatingUsersPermission, setIsUpdatingUsersPermission] =
    React.useState(false);
  const [isUpdatingShareCodePermission, setIsUpdatingShareCodePermission] =
    React.useState(false);

  const {
    accessToken,
    enableQuery,
    dialogSharePipelineIsOpen,
    updateDialogSharePipelineIsOpen,
    pipelineIsNew,
  } = useInstillStore(useShallow(selector));

  const { toast } = useToast();

  const pipeline = useUserPipeline({
    pipelineName: `users/${entity}/pipelines/${id}`,
    accessToken,
    enabled: enableQuery && !!accessToken && !pipelineIsNew,
  });

  const updatePipeline = useUpdateUserPipeline();

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

  const disableCopyLink = React.useMemo(() => {
    if (!pipeline.isSuccess) {
      return true;
    }

    if (pipelineIsPublic) {
      return false;
    }

    if (enableShareCode) {
      return false;
    }

    return true;
  }, [pipeline.isSuccess, pipelineIsPublic, enableShareCode]);

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
