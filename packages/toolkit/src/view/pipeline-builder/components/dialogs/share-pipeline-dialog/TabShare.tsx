import * as React from "react";
import { Button, Icons, Separator, useToast } from "@instill-ai/design-system";
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
} from "../../../../../lib";
import { useRouter } from "next/router";
import { isAxiosError } from "axios";
import { LoadingSpin } from "../../../../../components";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enableQuery: store.enabledQuery,
  pipelineIsNew: store.pipelineIsNew,
});

export const TabShare = () => {
  const { accessToken, enableQuery, pipelineIsNew } = useInstillStore(
    useShallow(selector)
  );
  const [isUpdatingShareCodePermission, setIsUpdatingShareCodePermission] =
    React.useState(false);

  const router = useRouter();
  const { id, entity } = router.query;
  const { toast } = useToast();

  const pipeline = useUserPipeline({
    pipelineName: `users/${entity}/pipelines/${id}`,
    accessToken,
    enabled: enableQuery && !!accessToken && !pipelineIsNew,
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

  const updatePipeline = useUpdateUserPipeline();

  const handleCopyLink = React.useCallback(async () => {
    if (!pipeline.isSuccess) return;

    setIsUpdatingShareCodePermission(true);

    if (pipelineIsPublic) {
      const link = `${env(
        "NEXT_PUBLIC_CONSOLE_BASE_URL"
      )}/${entity}/pipelines/${id}/builder`;

      navigator.clipboard.writeText(link);
      setIsUpdatingShareCodePermission(false);
      return;
    }

    const enabledShareByLink = pipeline.data.permission.share_code
      ? pipeline.data.permission.share_code.enabled
      : false;

    let link: Nullable<string> = null;

    if (!enabledShareByLink) {
      const payload: UpdateUserPipelinePayload = {
        name: `users/${entity}/pipelines/${id}`,
        permission: {
          users: pipeline.data.permission.users,
          share_code: {
            user: "users/*",
            role: pipeline.data.permission.share_code?.role
              ? pipeline.data.permission.share_code.role
              : "ROLE_VIEWER",
            enabled: true,
          },
        },
      };

      try {
        const { pipeline } = await updatePipeline.mutateAsync({
          payload,
          accessToken,
        });
        link = `${env(
          "NEXT_PUBLIC_CONSOLE_BASE_URL"
        )}/${entity}/pipelines/${id}/builder?view=${pipeline.permission
          .share_code?.code}`;
        setIsUpdatingShareCodePermission(false);
      } catch (error) {
        setIsUpdatingShareCodePermission(false);
        if (isAxiosError(error)) {
          toast({
            title: "Something went wrong when update pipeline permission",
            variant: "alert-error",
            size: "large",
            description: getInstillApiErrorMessage(error),
          });
        } else {
          toast({
            title: "Something went wrong when update pipeline permission",
            variant: "alert-error",
            size: "large",
            description: "Please try again later",
          });
        }
      }
    } else {
      link = `${env(
        "NEXT_PUBLIC_CONSOLE_BASE_URL"
      )}/${entity}/pipelines/${id}/builder?view=${pipeline.data.permission
        .share_code?.code}`;
      setIsUpdatingShareCodePermission(false);
    }

    if (link) {
      navigator.clipboard.writeText(link);
    }
  }, [pipeline.isSuccess, pipeline.data, pipelineIsPublic]);

  return (
    <div className="flex h-full w-full flex-col px-6 py-3">
      <div className="flex flex-row">
        <div className="mr-auto flex flex-row gap-x-3">
          {pipelineIsPublic ? (
            <Icons.LockUnlocked03 className="h-6 w-6 stroke-semantic-fg-secondary" />
          ) : (
            <Icons.Lock03 className="h-6 w-6 stroke-semantic-fg-secondary" />
          )}
          <p className="my-auto text-semantic-fg-secondary product-button-button-3">
            {pipelineIsPublic ? "Published Pipeline" : "Private Pipeline"}
          </p>
        </div>
        <p className="my-auto text-semantic-fg-secondary product-button-button-3">
          {pipelineIsPublic ? "Everyone can access" : "Limited Access"}
        </p>
      </div>
      <Separator orientation="horizontal" className="my-4" />
      <div className="flex flex-row">
        <div className="mr-auto flex flex-row gap-x-2">
          <div className="my-auto h-[30px] w-[30px] rounded-full bg-semantic-bg-line" />
          <p className="my-auto text-semantic-fg-disabled product-body-text-3-medium">
            {pipeline.data?.owner_name.split("/")[1]}
          </p>
        </div>
        <p className="my-auto text-semantic-fg-disabled product-body-text-3-medium">
          Owner
        </p>
      </div>
      <Separator orientation="horizontal" className="mb-5 mt-4" />
      <div className="flex flex-row">
        <Button
          variant="tertiaryColour"
          size="md"
          className="flex flex-row gap-x-2"
          onClick={() => handleCopyLink()}
        >
          {isUpdatingShareCodePermission ? (
            <LoadingSpin className="h-[14px] w-[14px] text-semantic-accent-default" />
          ) : (
            <Icons.Link01 className="h-[14px] w-[14px] stroke-semantic-accent-default" />
          )}
          {pipelineIsPublic ? "Copy Link" : "Copy Sharable Link"}
        </Button>
      </div>
    </div>
  );
};
