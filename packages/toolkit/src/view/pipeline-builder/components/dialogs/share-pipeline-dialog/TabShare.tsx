"use client";

import * as React from "react";
import { Button, Icons, Separator, useToast } from "@instill-ai/design-system";
import {
  InstillStore,
  Nullable,
  OrganizationOwner,
  UpdateUserPipelinePayload,
  UserOwner,
  env,
  getInstillApiErrorMessage,
  sendAmplitudeData,
  useAmplitudeCtx,
  useEntity,
  useInstillStore,
  useShallow,
  useUpdateUserPipeline,
  useUserPipeline,
} from "../../../../../lib";
import { useRouter } from "next/router";
import { isAxiosError } from "axios";
import { EntityAvatar, LoadingSpin } from "../../../../../components";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enableQuery: store.enabledQuery,
  pipelineIsNew: store.pipelineIsNew,
});

export const TabShare = () => {
  const { amplitudeIsInit } = useAmplitudeCtx();
  const { accessToken, enableQuery, pipelineIsNew } = useInstillStore(
    useShallow(selector)
  );
  const [isUpdatingShareCodePermission, setIsUpdatingShareCodePermission] =
    React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const router = useRouter();
  const { id, entity } = router.query;
  const { toast } = useToast();

  const entityObject = useEntity();

  const pipeline = useUserPipeline({
    pipelineName: entityObject.pipelineName,
    enabled: enableQuery && entityObject.isSuccess && !pipelineIsNew,
    accessToken,
  });

  const pipelineIsPublic = React.useMemo(() => {
    if (!pipeline.isSuccess) {
      return false;
    }

    const toplevelRule = pipeline.data.sharing.users["*/*"];

    if (toplevelRule && toplevelRule.enabled) {
      return true;
    } else {
      return false;
    }
  }, [pipeline.data, pipeline.isSuccess]);

  const updatePipeline = useUpdateUserPipeline();

  const handleCopyLink = React.useCallback(async () => {
    if (!pipeline.isSuccess || !entityObject.isSuccess) return;

    setIsUpdatingShareCodePermission(true);

    if (pipelineIsPublic) {
      const link = `${env(
        "NEXT_PUBLIC_CONSOLE_BASE_URL"
      )}/${entity}/pipelines/${id}`;

      navigator.clipboard.writeText(link);
      setIsUpdatingShareCodePermission(false);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1000);
      return;
    }

    const enabledShareByLink = pipeline.data.sharing.share_code
      ? pipeline.data.sharing.share_code.enabled
      : false;

    let link: Nullable<string> = null;

    if (!enabledShareByLink) {
      const payload: UpdateUserPipelinePayload = {
        name: entityObject.pipelineName,
        sharing: {
          users: pipeline.data.sharing.users,
          share_code: {
            user: "*/*",
            role: pipeline.data.sharing.share_code?.role
              ? pipeline.data.sharing.share_code.role
              : "ROLE_EXECUTOR",
            enabled: true,
          },
        },
      };

      try {
        const { pipeline } = await updatePipeline.mutateAsync({
          payload,
          accessToken,
        });

        if (amplitudeIsInit) {
          sendAmplitudeData("enable_pipeline_share_by_link");
        }

        link = `${env(
          "NEXT_PUBLIC_CONSOLE_BASE_URL"
        )}/${entity}/pipelines/${id}?view=${pipeline.sharing.share_code?.code}`;
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
      )}/${entity}/pipelines/${id}?view=${
        pipeline.data.sharing.share_code?.code
      }`;
      setIsUpdatingShareCodePermission(false);
    }

    if (link) {
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  }, [
    pipeline.isSuccess,
    pipeline.data,
    pipelineIsPublic,
    accessToken,
    entity,
    id,
    updatePipeline,
    toast,
    entityObject.isSuccess,
    entityObject.pipelineName,
    amplitudeIsInit,
  ]);

  const pipelineAvatar = React.useMemo(() => {
    if (!pipeline.isSuccess) {
      return null;
    }

    if (pipeline.data.owner_name.split("/")[0] === "users") {
      return (pipeline.data.owner as UserOwner).user.profile?.avatar ?? null;
    }

    if (pipeline.data.owner_name.split("/")[0] === "organizations") {
      return (
        (pipeline.data.owner as OrganizationOwner).organization.profile
          ?.avatar ?? null
      );
    }

    return null;
  }, [pipeline.isSuccess, pipeline.data]);

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
          <EntityAvatar
            src={pipelineAvatar}
            entityName={pipeline.data?.owner_name ?? ""}
            className="h-[30px] w-[30px]"
            fallbackImg={
              <div className="flex h-[30px] w-[30px] rounded-full bg-semantic-bg-secondary">
                <Icons.User02 className="m-auto h-4 w-4 stroke-semantic-fg-disabled" />
              </div>
            }
          />
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
            <LoadingSpin className="!h-[14px] !w-[14px] !text-semantic-accent-default" />
          ) : copied ? (
            <Icons.Check className="h-[14px] w-[14px] stroke-semantic-accent-default" />
          ) : (
            <Icons.Link01 className="h-[14px] w-[14px] stroke-semantic-accent-default" />
          )}
          {pipelineIsPublic ? "Copy Link" : "Copy Sharable Link"}
        </Button>
      </div>
    </div>
  );
};
