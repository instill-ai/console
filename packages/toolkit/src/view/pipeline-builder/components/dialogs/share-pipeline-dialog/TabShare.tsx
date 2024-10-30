"use client";

import type {
  OrganizationOwner,
  UpdateNamespacePipelineRequest,
  UserOwner,
} from "instill-sdk";
import * as React from "react";
import { InstillNameInterpreter } from "instill-sdk";

import { Button, Icons, Separator, useToast } from "@instill-ai/design-system";

import { LoadingSpin } from "../../../../../components";
import { NamespaceAvatarWithFallback } from "../../../../../components/NamespaceAvatarWithFallback";
import {
  InstillStore,
  Nullable,
  sendAmplitudeData,
  toastInstillError,
  useAmplitudeCtx,
  useInstillStore,
  useNamespacePipeline,
  useShallow,
  useUpdateNamespacePipeline,
} from "../../../../../lib";
import { env } from "../../../../../server";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enableQuery: store.enabledQuery,
  pipelineIsNew: store.pipelineIsNew,
});

export const TabShare = ({
  pipelineName,
  id,
  namespaceId,
  ownerDisplayName,
}: {
  pipelineName: Nullable<string>;
  id: Nullable<string>;
  namespaceId: Nullable<string>;
  ownerDisplayName: Nullable<string>;
}) => {
  const { amplitudeIsInit } = useAmplitudeCtx();
  const { accessToken, enableQuery, pipelineIsNew } = useInstillStore(
    useShallow(selector),
  );
  const [isUpdatingShareCodePermission, setIsUpdatingShareCodePermission] =
    React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const { toast } = useToast();

  const pipeline = useNamespacePipeline({
    namespaceId: pipelineName
      ? InstillNameInterpreter.pipeline(pipelineName).namespaceId
      : null,
    pipelineId: pipelineName
      ? InstillNameInterpreter.pipeline(pipelineName).resourceId
      : null,
    enabled: enableQuery && !!pipelineName && !pipelineIsNew,
    accessToken,
    view: "VIEW_FULL",
    shareCode: null,
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

  const updatePipeline = useUpdateNamespacePipeline();

  const handleCopyLink = React.useCallback(async () => {
    if (!pipeline.isSuccess || !pipelineName) return;

    setIsUpdatingShareCodePermission(true);

    if (pipelineIsPublic) {
      const link = `${env(
        "NEXT_PUBLIC_CONSOLE_BASE_URL",
      )}/${namespaceId}/pipelines/${id}/playground`;

      navigator.clipboard.writeText(link);
      setIsUpdatingShareCodePermission(false);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1000);
      return;
    }

    const enabledShareByLink = pipeline.data.sharing.shareCode
      ? pipeline.data.sharing.shareCode.enabled
      : false;

    let link: Nullable<string> = null;

    if (!enabledShareByLink && pipelineName) {
      const payload: UpdateNamespacePipelineRequest = {
        namespaceId: InstillNameInterpreter.pipeline(pipelineName).namespaceId,
        pipelineId: InstillNameInterpreter.pipeline(pipelineName).resourceId,
        sharing: {
          users: pipeline.data.sharing.users,
          shareCode: {
            user: "*/*",
            role: pipeline.data.sharing.shareCode?.role
              ? pipeline.data.sharing.shareCode.role
              : "ROLE_EXECUTOR",
            enabled: true,
          },
        },
      };

      try {
        const { pipeline } = await updatePipeline.mutateAsync({
          ...payload,
          accessToken,
        });

        if (amplitudeIsInit) {
          sendAmplitudeData("enable_pipeline_share_by_link");
        }

        link = `${env(
          "NEXT_PUBLIC_CONSOLE_BASE_URL",
        )}/${namespaceId}/pipelines/${id}/playground?view=${pipeline.sharing.shareCode?.code}`;
        setIsUpdatingShareCodePermission(false);
      } catch (error) {
        setIsUpdatingShareCodePermission(false);

        toastInstillError({
          title: "Something went wrong when update pipeline permission",
          error,
          toast,
        });
      }
    } else {
      link = `${env(
        "NEXT_PUBLIC_CONSOLE_BASE_URL",
      )}/${namespaceId}/pipelines/${id}/playground?view=${
        pipeline.data.sharing.shareCode?.code
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
    namespaceId,
    id,
    updatePipeline,
    toast,
    amplitudeIsInit,
    pipelineName,
  ]);

  const pipelineAvatar = React.useMemo(() => {
    if (!pipeline.isSuccess) {
      return null;
    }

    if (pipeline.data.ownerName.split("/")[0] === "users") {
      return (pipeline.data.owner as UserOwner).user.profile?.avatar ?? null;
    }

    if (pipeline.data.ownerName.split("/")[0] === "organizations") {
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
          {namespaceId ? (
            <NamespaceAvatarWithFallback.Root
              src={pipelineAvatar}
              className="my-auto h-6 w-6"
              fallback={
                <NamespaceAvatarWithFallback.Fallback
                  namespaceId={namespaceId}
                  displayName={ownerDisplayName}
                  className="my-auto flex h-6 w-6"
                />
              }
            />
          ) : null}

          <p className="my-auto text-semantic-fg-disabled product-body-text-3-medium">
            {pipeline.data?.ownerName.split("/")[1]}
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
